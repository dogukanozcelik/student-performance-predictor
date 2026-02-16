import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

df = pd.read_csv('Data/student_information.csv')

df = pd.get_dummies(df)


X = df.drop(['G3'], axis=1)
y = df['G3']

feature_names = X.columns.tolist()
joblib.dump(feature_names, 'model-service/models/feature_names.pkl')

x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=.2)

model = RandomForestRegressor()
model.fit(x_train, y_train)

joblib.dump(model, 'model-service/models/model.pkl')
print("Model saved successfully.")