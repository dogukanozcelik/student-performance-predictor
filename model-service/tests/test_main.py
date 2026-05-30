from fastapi.testclient import TestClient

from tests.helpers import load_model_service


def test_health_endpoint(monkeypatch):
    module = load_model_service(monkeypatch)
    client = TestClient(module.app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_predict_g3_returns_expected_shape(monkeypatch, student_payload):
    module = load_model_service(monkeypatch, g3_value=17)
    client = TestClient(module.app)

    response = client.post("/predict-g3", json=student_payload)

    assert response.status_code == 200

    data = response.json()
    assert data["predicted_G3"] == 85.0
    assert data["success_level"] == "high"
    assert data["confidence"] == 0.8
    assert data["class_probabilities"] == {"low": 0.2, "high": 0.8}
    assert data["segment"] == {"segment_id": 2, "segment_name": "Segment 2"}


def test_predict_g3_clamps_upper_bound(monkeypatch, student_payload):
    module = load_model_service(monkeypatch, g3_value=25)
    client = TestClient(module.app)

    response = client.post("/predict-g3", json=student_payload)

    assert response.status_code == 200
    assert response.json()["predicted_G3"] == 100.0


def test_predict_g3_clamps_lower_bound(monkeypatch, student_payload):
    module = load_model_service(monkeypatch, g3_value=-3)
    client = TestClient(module.app)

    response = client.post("/predict-g3", json=student_payload)

    assert response.status_code == 200
    assert response.json()["predicted_G3"] == 0.0