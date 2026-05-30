import importlib.util
from pathlib import Path
from unittest.mock import patch

import pandas as pd
import pytest
from fastapi.testclient import TestClient


def load_main_module():
    main_path = Path(__file__).resolve().parents[1] / "main.py"
    spec = importlib.util.spec_from_file_location("model_service_main", str(main_path))
    module = importlib.util.module_from_spec(spec)

    class LoadedRegressionModel:
        def predict(self, X):
            return [3.2]

    class LoadedClassifier:
        def predict(self, X):
            return [0 for _ in range(len(X))]

    class LoadedLabelEncoder:
        classes_ = ["low", "high"]

        def inverse_transform(self, values):
            return [self.classes_[int(value)] for value in values]

    class LoadedSegmentationModel:
        def predict(self, X):
            return [0 for _ in range(len(X))]

    loaded_artifacts = {
        "g3_pipeline.pkl": LoadedRegressionModel(),
        "gb_classifier.pkl": LoadedClassifier(),
        "label_encoder.pkl": LoadedLabelEncoder(),
        "segmentation_model.pkl": LoadedSegmentationModel(),
        "cluster_names.pkl": ["segA"],
    }

    sample_dataset = pd.DataFrame([
        {
            "school": "GP",
            "sex": "F",
            "age": 17,
            "address": "U",
            "famsize": "GT3",
            "Pstatus": "A",
            "Medu": 4,
            "Fedu": 4,
            "Mjob": "teacher",
            "Fjob": "services",
            "reason": "course",
            "guardian": "mother",
            "traveltime": 1,
            "studytime": 2,
            "failures": 0,
            "schoolsup": "no",
            "famsup": "no",
            "paid": "no",
            "activities": "no",
            "nursery": "yes",
            "higher": "yes",
            "internet": "yes",
            "romantic": "no",
            "famrel": 4,
            "freetime": 3,
            "goout": 2,
            "Dalc": 1,
            "Walc": 1,
            "health": 5,
            "absences": 3,
            "G1": 10,
            "G2": 11,
            "G3": 12,
        },
        {
            "school": "GP",
            "sex": "M",
            "age": 18,
            "address": "U",
            "famsize": "GT3",
            "Pstatus": "T",
            "Medu": 2,
            "Fedu": 2,
            "Mjob": "at_home",
            "Fjob": "other",
            "reason": "home",
            "guardian": "father",
            "traveltime": 2,
            "studytime": 1,
            "failures": 1,
            "schoolsup": "yes",
            "famsup": "no",
            "paid": "yes",
            "activities": "no",
            "nursery": "yes",
            "higher": "no",
            "internet": "yes",
            "romantic": "yes",
            "famrel": 3,
            "freetime": 2,
            "goout": 3,
            "Dalc": 2,
            "Walc": 3,
            "health": 4,
            "absences": 8,
            "G1": 8,
            "G2": 9,
            "G3": 10,
        },
    ])

    with patch("joblib.load", side_effect=lambda path: loaded_artifacts[Path(path).name]), patch(
        "pandas.read_csv", return_value=sample_dataset
    ):
        spec.loader.exec_module(module)
    return module


def make_sample_payload():
    # Minimal valid StudentInput payload used by the endpoint
    base = {
        "student_id": 1,
        "first_name": "Test",
        "last_name": "Student",
        "school": "GP",
        "sex": "F",
        "age": 17,
        "address": "U",
        "famsize": "GT3",
        "Pstatus": "A",
        "Medu": 4,
        "Fedu": 4,
        "Mjob": "teacher",
        "Fjob": "services",
        "reason": "course",
        "guardian": "mother",
        "traveltime": 1,
        "studytime": 2,
        "failures": 0,
        "schoolsup": "no",
        "famsup": "no",
        "paid": "no",
        "activities": "no",
        "nursery": "yes",
        "higher": "yes",
        "internet": "yes",
        "romantic": "no",
        "famrel": 4,
        "freetime": 3,
        "goout": 2,
        "Dalc": 1,
        "Walc": 1,
        "health": 5,
        "absences": 3,
        "G1": 10,
        "G2": 11,
    }
    return base


class DummyModel:
    def predict(self, X):
        # return a constant prediction for G3 (regression target)
        return [3.2]


class DummyClassifier:
    classes_ = ["low", "high"]

    def predict(self, X):
        return [1]

    def predict_proba(self, X):
        return [[0.1, 0.9]]


class DummyLabelEncoder:
    classes_ = ["low", "high"]

    def inverse_transform(self, arr):
        return [self.classes_[int(arr[0])]]


class DummySegmentation:
    def predict(self, X):
        return [2]


def test_predict_g3_endpoint(monkeypatch):
    main = load_main_module()

    # Patch heavy model objects with small dummies
    monkeypatch.setattr(main, "g3_model", DummyModel())
    monkeypatch.setattr(main, "gb_classifier", DummyClassifier())
    monkeypatch.setattr(main, "label_encoder", DummyLabelEncoder())
    monkeypatch.setattr(main, "segmentation_model", DummySegmentation())
    monkeypatch.setattr(main, "cluster_names", ["segA", "segB", "segC"])
    monkeypatch.setattr(
        main,
        "CLASS_PROFILES",
        {
            "high": {
                "average_G3_raw": 12.5,
                "average_G3_score": 62.5,
                "student_count": 7,
            }
        },
    )
    monkeypatch.setattr(
        main,
        "SEGMENT_PROFILES",
        {
            "segC": {
                "average_G3_raw": 11.0,
                "average_G3_score": 55.0,
                "student_count": 4,
                "segment_id": 2,
            }
        },
    )

    client = TestClient(main.app)
    payload = make_sample_payload()

    response = client.post("/predict-g3", json=payload)
    assert response.status_code == 200

    data = response.json()

    # Basic shape and types
    assert "predicted_G3" in data
    assert isinstance(data["predicted_G3"], (int, float))
    assert data["success_level"] in DummyLabelEncoder.classes_
    assert "confidence" in data
    assert "class_probabilities" in data
    assert "segment" in data
    assert isinstance(data["segment"]["segment_id"], int)
    assert "success_level_info" in data
    assert data["success_level_info"]["population_profile"]["student_count"] >= 0
    assert "population_profile" in data["segment"]


def test_health_endpoint():
    main = load_main_module()
    client = TestClient(main.app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "ok"
