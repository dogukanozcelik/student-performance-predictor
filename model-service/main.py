from pathlib import Path
from io import BytesIO
import base64

import joblib
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import shap

from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(
    title="Student Performance Predictor Model Service",
    version="1.0"
)

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DATASET_PATH = PROJECT_ROOT / "Data" / "student_information.csv"
MODEL_DIR = BASE_DIR / "models"

FEATURE_COLUMNS = [
    "school",
    "sex",
    "age",
    "address",
    "famsize",
    "Pstatus",
    "Medu",
    "Fedu",
    "Mjob",
    "Fjob",
    "reason",
    "guardian",
    "traveltime",
    "studytime",
    "failures",
    "schoolsup",
    "famsup",
    "paid",
    "activities",
    "nursery",
    "higher",
    "internet",
    "romantic",
    "famrel",
    "freetime",
    "goout",
    "Dalc",
    "Walc",
    "health",
    "absences",
    "G1",
    "G2",
]

SEGMENTATION_FEATURE_COLUMNS = [
    column for column in FEATURE_COLUMNS if column not in {"G1", "G2"}
]

try:
    explanation_dataset = pd.read_csv(DATASET_PATH)
except FileNotFoundError:
    explanation_dataset = pd.DataFrame(columns=FEATURE_COLUMNS + ["G3"])


def load_model(filename):
    return joblib.load(MODEL_DIR / filename)


def _encode_figure(fig) -> str:
    buffer = BytesIO()
    fig.savefig(buffer, format="png", bbox_inches="tight", dpi=160)
    plt.close(fig)
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def _cluster_label(cluster_id: int) -> str:
    try:
        return str(cluster_names[int(cluster_id)])
    except (IndexError, TypeError, ValueError):
        return f"Cluster {cluster_id}"


def _pretty_feature_label(feature_name: str) -> str:
    if not feature_name:
        return feature_name

    cleaned_name = str(feature_name)
    if "__" in cleaned_name:
        _, cleaned_name = cleaned_name.split("__", 1)

    if "_" in cleaned_name:
        parts = cleaned_name.split("_", 1)
        if len(parts) == 2 and parts[0] in FEATURE_COLUMNS:
            return f"{parts[0]} = {parts[1]}"

    return cleaned_name


def build_shap_visual(model_pipeline, student_frame: pd.DataFrame, background_frame: pd.DataFrame):
    try:
        if background_frame.empty:
            return None

        preprocessor = model_pipeline.named_steps["preprocessor"]
        model = model_pipeline.named_steps["model"]
        feature_names = [
            _pretty_feature_label(name)
            for name in preprocessor.get_feature_names_out()
        ]

        background_sample = background_frame.sample(
            n=min(len(background_frame), 100),
            random_state=42,
        )
        background_processed = preprocessor.transform(background_sample)
        student_processed = preprocessor.transform(student_frame)

        if hasattr(background_processed, "toarray"):
            background_processed = background_processed.toarray()

        if hasattr(student_processed, "toarray"):
            student_processed = student_processed.toarray()

        background_processed_df = pd.DataFrame(background_processed, columns=feature_names)
        student_processed_df = pd.DataFrame(student_processed, columns=feature_names)

        explainer = shap.Explainer(model, background_processed_df)
        shap_values = explainer(student_processed_df)

        fig = plt.figure(figsize=(11, 6))
        shap.plots.waterfall(shap_values[0], max_display=10, show=False)
        fig = plt.gcf()
        return _encode_figure(fig)
    except Exception:
        return None


def build_segmentation_visual(segmentation_pipeline, student_frame: pd.DataFrame, background_frame: pd.DataFrame):
    try:
        if background_frame.empty:
            return None

        preprocessor = segmentation_pipeline.named_steps["preprocessor"]
        pca = segmentation_pipeline.named_steps["pca"]
        model = segmentation_pipeline.named_steps["model"]

        background_processed = preprocessor.transform(background_frame)
        background_pca = pca.transform(background_processed)
        background_clusters = model.predict(background_pca)

        student_processed = preprocessor.transform(student_frame)
        student_pca = pca.transform(student_processed)
        student_cluster = int(model.predict(student_pca)[0])
        student_cluster_label = _cluster_label(student_cluster)

        fig, ax = plt.subplots(figsize=(11, 6))
        unique_clusters = sorted(set(int(cluster_id) for cluster_id in background_clusters))
        cmap = plt.get_cmap("viridis", max(len(unique_clusters), 1))

        for index, cluster_id in enumerate(unique_clusters):
            cluster_mask = background_clusters == cluster_id
            ax.scatter(
                background_pca[cluster_mask, 0],
                background_pca[cluster_mask, 1],
                color=cmap(index),
                alpha=0.7,
                s=24,
                label=_cluster_label(cluster_id),
            )

        ax.scatter(
            student_pca[0, 0],
            student_pca[0, 1],
            color="red",
            s=220,
            edgecolors="black",
            linewidths=1.5,
            label=f"Selected Student ({student_cluster_label})",
        )
        ax.set_xlabel("PCA Component 1")
        ax.set_ylabel("PCA Component 2")
        ax.set_title("Student Segmentation Overview")
        ax.legend(loc="best", title="Clusters")

        return _encode_figure(fig)
    except Exception:
        return None


# Regression model
g3_model = load_model("g3_pipeline.pkl")

# Classification model
gb_classifier = load_model("gb_classifier.pkl")

# Label encoder
label_encoder = load_model("label_encoder.pkl")

# Segmentation model
segmentation_model = load_model("segmentation_model.pkl")

# Cluster names
cluster_names = load_model("cluster_names.pkl")


def _safe_scaled_average(series: pd.Series) -> dict:
    if series.empty:
        return {
            "average_G3_raw": None,
            "average_G3_score": None,
            "student_count": 0,
        }

    average_raw = float(series.mean())
    return {
        "average_G3_raw": round(average_raw, 2),
        "average_G3_score": int(round(average_raw * 5)),
        "student_count": int(series.shape[0]),
    }


def build_population_summaries():
    if explanation_dataset.empty or "G3" not in explanation_dataset.columns:
        return {}, {}

    dataset_frame = explanation_dataset.copy()
    available_feature_columns = [
        column for column in FEATURE_COLUMNS if column in dataset_frame.columns
    ]

    if len(available_feature_columns) != len(FEATURE_COLUMNS):
        return {}, {}

    feature_frame = dataset_frame[FEATURE_COLUMNS].copy()
    class_predictions = label_encoder.inverse_transform(
        gb_classifier.predict(feature_frame)
    )

    class_frame = dataset_frame.copy()
    class_frame["_predicted_class"] = class_predictions
    class_profiles = {
        label: _safe_scaled_average(group["G3"])
        for label, group in class_frame.groupby("_predicted_class")
    }

    segmentation_input = dataset_frame[SEGMENTATION_FEATURE_COLUMNS].copy()
    segment_ids = segmentation_model.predict(segmentation_input)

    segment_frame = dataset_frame.copy()
    segment_frame["_segment_id"] = segment_ids

    segment_profiles = {}
    for segment_id, group in segment_frame.groupby("_segment_id"):
        segment_name = cluster_names[int(segment_id)]
        segment_profiles[segment_name] = {
            **_safe_scaled_average(group["G3"]),
            "segment_id": int(segment_id),
        }

    return class_profiles, segment_profiles


CLASS_PROFILES, SEGMENT_PROFILES = build_population_summaries()


class StudentInput(BaseModel):
    student_id: int
    first_name: str
    last_name: str
    school: str
    sex: str
    age: int
    address: str
    famsize: str
    Pstatus: str
    Medu: int
    Fedu: int
    Mjob: str
    Fjob: str
    reason: str
    guardian: str
    traveltime: int
    studytime: int
    failures: int
    schoolsup: str
    famsup: str
    paid: str
    activities: str
    nursery: str
    higher: str
    internet: str
    romantic: str
    famrel: int
    freetime: int
    goout: int
    Dalc: int
    Walc: int
    health: int
    absences: int
    G1: int
    G2: int


@app.get("/health")
def health():
    return {
        "status": "ok",
        "models": [
            "G3 Regression Pipeline",
            "Performance Classification Pipeline",
            "Student Segmentation Pipeline"
        ]
    }


@app.post("/predict-g3")
def predict_g3(data: StudentInput):

    input_df = pd.DataFrame([
        data.model_dump()
    ]).drop(columns=['student_id', 'first_name', 'last_name'])

    # -------------------------
    # G3 REGRESSION PREDICTION
    # -------------------------
    predicted_g3 = g3_model.predict(input_df)[0]

    predicted_g3 = max(
        0,
        min(20, float(predicted_g3))
    ) * 5

    # -------------------------
    # CLASSIFICATION PREDICTION
    # -------------------------
    pred_class_encoded = gb_classifier.predict(
        input_df
    )[0]

    pred_class = label_encoder.inverse_transform(
        [pred_class_encoded]
    )[0]

    # Classification probabilities
    probabilities = gb_classifier.predict_proba(
        input_df
    )[0]

    class_probabilities = {
        label: round(float(prob), 4)
        for label, prob in zip(
            label_encoder.classes_,
            probabilities
        )
    }

    confidence = round(
        float(max(probabilities)),
        4
    )

    # -------------------------
    # SEGMENTATION PREDICTION
    # -------------------------
    segmentation_input = input_df.drop(
        columns=["G1", "G2"],
        errors="ignore"
    )

    segment_id = segmentation_model.predict(
        segmentation_input
    )[0]

    segment_name = cluster_names[
        int(segment_id)
    ]

    success_level_info = {
        "label": pred_class,
        "confidence": confidence,
        "probabilities": class_probabilities,
        "population_profile": CLASS_PROFILES.get(pred_class, {
            "average_G3_raw": None,
            "average_G3_score": None,
            "student_count": 0,
        }),
    }

    segment_info = {
        "segment_id": int(segment_id),
        "segment_name": segment_name,
        "population_profile": SEGMENT_PROFILES.get(segment_name, {
            "average_G3_raw": None,
            "average_G3_score": None,
            "student_count": 0,
        }),
    }

    visuals = {
        "shap_png_base64": build_shap_visual(
            g3_model,
            input_df[FEATURE_COLUMNS],
            explanation_dataset[FEATURE_COLUMNS] if not explanation_dataset.empty else pd.DataFrame(columns=FEATURE_COLUMNS),
        ),
        "segment_png_base64": build_segmentation_visual(
            segmentation_model,
            segmentation_input,
            explanation_dataset[SEGMENTATION_FEATURE_COLUMNS] if not explanation_dataset.empty else pd.DataFrame(columns=SEGMENTATION_FEATURE_COLUMNS),
        ),
    }

    return {
        "predicted_G3": round(predicted_g3, 2),
        "success_level": pred_class,
        "success_level_info": success_level_info,
        "confidence": confidence,
        "class_probabilities": class_probabilities,
        "segment": segment_info,
        "visuals": visuals,
    }