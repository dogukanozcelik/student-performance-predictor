# GP

Student performance analytics and prediction platform with three parts:

- `backend`: Node.js and Express API for authentication, student management, reports, and model prediction routes.
- `frontend`: React + Vite dashboard for logging in, browsing students, and viewing student details.
- `model-service`: FastAPI service that serves the trained machine learning models used for prediction and segmentation.

## Project Structure

```text
backend/         Express API and route controllers
frontend/        React UI built with Vite
model-service/    Python model API and trained artifacts
Data/            Dataset and notebook used for analysis/training
```

## Requirements

- Node.js 18+
- npm
- Python 3.10+

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend runs on port `5001` by default.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Useful scripts:

- `npm run build` - create a production build
- `npm run lint` - run ESLint

## Model Service Setup

```bash
cd model-service
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The model service exposes a health check at `/health` and prediction endpoints for grade, class, and segmentation outputs.

## Notes

- Make sure the trained model files exist in `model-service/models/` before starting the Python service.
- If your backend uses environment variables, place them in a `.env` file under `backend/`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.