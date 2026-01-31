# Task Manager

A full-stack task management application for creating, viewing, updating, and deleting tasks. Built with React and Node.js, with a clean UI and light/dark theme support.

![Task Manager](https://img.shields.io/badge/stack-React%20%7C%20Node.js%20%7C%20MongoDB-blue)

---

## Project Overview

Task Manager lets users:

- **Create** tasks with a title, optional description, and status (pending, in progress, completed)
- **View** all tasks in a responsive list
- **Update** tasks via an edit form or by changing status directly in the list
- **Delete** tasks with a confirmation step

The app uses a REST API on the backend and stores data in MongoDB. The frontend is a single-page React app with theme persistence (light/dark) and no external UI libraries.

---

## Tech Stack

| Layer      | Technology |
| ---------- | ---------- |
| **Frontend** | React 18, Vite, Axios |
| **Backend**  | Node.js, Express 5 |
| **Database** | MongoDB (Mongoose ODM) |
| **Styling**  | CSS (flexbox, CSS variables, light/dark theme) |

### Key Dependencies

- **Frontend:** `react`, `react-dom`, `axios`, `vite`, `@vitejs/plugin-react`
- **Backend:** `express`, `mongoose`, `cors`, `dotenv`

---

## Setup Instructions

### Prerequisites

- **Node.js** (v18 or later recommended)
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account)
- **npm** (or yarn/pnpm)

### 1. Clone and enter the project

```bash
git clone <repository-url>
cd app
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and set:

| Variable   | Description                    | Example |
| ---------- | ------------------------------ | ------- |
| `PORT`     | Server port (optional)          | `5000`  |
| `MONGO_URI`| MongoDB connection string      | `mongodb://localhost:27017/app` or your Atlas URI |

**Local MongoDB:** Use `mongodb://localhost:27017/app`  
**MongoDB Atlas:** Use your cluster connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)

Start the backend:

```bash
npm start
```

You should see:

- `Server running on http://localhost:5000`
- `Connected to MongoDB` (if the connection succeeds)

### 3. Frontend setup

Open a **new terminal**, then:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173** (or the port Vite prints).

### 4. Use the app

- Ensure the **backend** is running on port **5000** and **MongoDB** is reachable.
- Open **http://localhost:5173** in your browser.
- Add, edit, and delete tasks; switch between light and dark theme (saved in `localStorage`).

---

## API Endpoints

Base URL: `http://localhost:5000/api/tasks`

| Method   | Endpoint        | Description           | Request body (JSON) |
| -------- | ---------------- | --------------------- | --------------------|
| `GET`    | `/api/tasks`     | Get all tasks         | —                    |
| `POST`   | `/api/tasks`     | Create a task         | `{ title, description?, status? }` |
| `PUT`    | `/api/tasks/:id` | Update a task by ID   | `{ title?, description?, status? }` |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID   | —                    |

### Task object

- `title` (string, required)
- `description` (string, optional)
- `status` (string, optional): `"pending"` \| `"in-progress"` \| `"completed"` (default: `"pending"`)
- `_id`, `createdAt`, `updatedAt` are set by the server.

### Example

**Create a task:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","description":"Optional details","status":"pending"}'
```

**Get all tasks:**

```bash
curl http://localhost:5000/api/tasks
```

---

## Folder Structure

```
app/
├── README.md
├── PROJECT_OVERVIEW.md
├── frontend/                 # React (Vite) app
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx         # Entry point
│       ├── App.jsx          # Root component, state, theme, handlers
│       ├── index.css        # Global styles, theme variables
│       ├── components/
│       │   ├── TaskForm.jsx  # Add/Edit task form
│       │   ├── TaskList.jsx  # Fetches and renders task list
│       │   └── TaskItem.jsx  # Single task row (title, status, actions)
│       └── services/
│           └── api.js       # Axios client, API helpers (getTasks, createTask, etc.)
│
└── backend/                 # Express API
    ├── .env                 # Local config (create from .env.example)
    ├── .env.example         # Template for PORT, MONGO_URI
    ├── package.json
    ├── server.js            # Express app, middleware, routes, MongoDB connection
    ├── models/
    │   └── Task.js           # Mongoose schema and model
    ├── controllers/
    │   └── taskController.js # createTask, getAllTasks, updateTaskById, deleteTaskById
    └── routes/
        └── taskRoutes.js    # POST/GET /api/tasks, PUT/DELETE /api/tasks/:id
```

---

## Scripts

### Backend (`backend/`)

| Command       | Description              |
| ------------- | ------------------------ |
| `npm start`  | Run server (`node server.js`) |

### Frontend (`frontend/`)

| Command        | Description           |
| -------------- | --------------------- |
| `npm run dev`  | Start Vite dev server  |
| `npm run build`| Production build      |
| `npm run preview` | Preview production build |

---

## License

ISC
