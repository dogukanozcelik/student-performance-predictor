import importlib.util
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


def load_main_module():
    main_path = Path(__file__).resolve().parents[1] / "main.py"
    spec = importlib.util.spec_from_file_location("model_service_main", str(main_path))
    module = importlib.util.module_from_spec(spec)
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


def test_health_endpoint():
    main = load_main_module()
    client = TestClient(main.app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "ok"
