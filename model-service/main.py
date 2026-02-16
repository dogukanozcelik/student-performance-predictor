import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

model = joblib.load('models/model.pkl')
feature_names = joblib.load('models/feature_names.pkl')

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
    return {"status": "ok"}


@app.post("/predict")
def predict(data: StudentInput):
    input_df = pd.DataFrame([data.model_dump()])

    input_df = pd.get_dummies(input_df)

    input_df = input_df.reindex(columns=feature_names, fill_value=0)

    prediction = model.predict(input_df)[0]

    return {
        "predicted_G3": round(float(prediction), 2),
        "risk_level": get_risk_level(prediction)
    }

def get_risk_level(score):
    if score < 50:
        return "High Risk"
    elif score < 70:
        return "Medium Risk"
    return "Low Risk"