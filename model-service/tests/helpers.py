import importlib.util
from pathlib import Path

import joblib


class FakeG3Model:
    def __init__(self, predicted_value):
        self.predicted_value = predicted_value
        self.last_input = None

    def predict(self, input_df):
        self.last_input = input_df.copy()
        return [self.predicted_value]


class FakeClassifier:
    def __init__(self, predicted_class=1, probabilities=None):
        self.predicted_class = predicted_class
        self.probabilities = probabilities or [0.2, 0.8]
        self.last_input = None

    def predict(self, input_df):
        self.last_input = input_df.copy()
        return [self.predicted_class]

    def predict_proba(self, input_df):
        self.last_input = input_df.copy()
        return [self.probabilities]


class FakeLabelEncoder:
    classes_ = ["low", "high"]

    def inverse_transform(self, values):
        mapping = {0: "low", 1: "high"}
        return [mapping[value] for value in values]


class FakeSegmentationModel:
    def __init__(self, segment_id=2):
        self.segment_id = segment_id
        self.last_input = None

    def predict(self, input_df):
        self.last_input = input_df.copy()
        return [self.segment_id]


def load_model_service(monkeypatch, g3_value=17):
    fake_models = [
        FakeG3Model(g3_value),
        FakeClassifier(),
        FakeLabelEncoder(),
        FakeSegmentationModel(),
        ["Segment 0", "Segment 1", "Segment 2"],
    ]

    def fake_load(_path):
        return fake_models.pop(0)

    monkeypatch.setattr(joblib, "load", fake_load)

    module_path = Path(__file__).resolve().parents[1] / "main.py"
    spec = importlib.util.spec_from_file_location("model_service_main", module_path)
    module = importlib.util.module_from_spec(spec)
    if spec.loader is None:
        raise RuntimeError("Model service module could not be loaded.")
    spec.loader.exec_module(module)
    return module