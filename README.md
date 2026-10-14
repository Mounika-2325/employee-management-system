# Employee Management System

A full-stack employee management web application built with React + Vite on the frontend and Express + MongoDB/Mongoose on the backend.

## Features

- Dashboard with employee statistics
- Add, edit, view, and delete employees
- Real-time search and department filtering
- Responsive employee table and mobile cards
- REST API with validation and error handling
- Toast notifications and modal dialogs

## Project structure

- `backend/` — Express API and MongoDB models
- `frontend/` — React Vite dashboard UI

## Getting started

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api`.

## Environment variables

Backend `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_management?retryWrites=true&w=majority
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

The backend connects to MongoDB before it starts accepting requests. The connection selects the `employee_management` database. If MongoDB is unavailable, the server exits instead of switching to temporary storage.

To add the sample employees, configure `backend/.env` with your Atlas URI, then run `npm run seed` from the `backend/` directory.
