import joblib
import pandas as pd

from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(
    title="Student Performance Predictor Model Service",
    version="1.0"
)

# Regression model
g3_model = joblib.load(
    "models/g3_pipeline.pkl"
)

# Classification model
gb_classifier = joblib.load(
    "models/gb_classifier.pkl"
)

# Label encoder
label_encoder = joblib.load(
    "models/label_encoder.pkl"
)

# Segmentation model
segmentation_model = joblib.load(
    "models/segmentation_model.pkl"
)

# Cluster names
cluster_names = joblib.load(
    "models/cluster_names.pkl"
)


class StudentInput(BaseModel):
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
    ])

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

    return {
        "predicted_G3": round(predicted_g3, 2),
        "success_level": pred_class,
        "confidence": confidence,
        "class_probabilities": class_probabilities,
        "segment": {
            "segment_id": int(segment_id),
            "segment_name": segment_name
        }
    }