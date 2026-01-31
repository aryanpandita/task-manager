# Task Management App – Interview Overview

## 1. What Is This Project?

A **full-stack Task Management application** where users can:
- **Create** tasks (title, description, status)
- **Read** all tasks (listed on the page)
- **Update** tasks (edit form or change status via dropdown)
- **Delete** tasks

**Stack:**
- **Frontend:** React (Vite), functional components + hooks, axios, CSS (light/dark theme)
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (local or Atlas)

---

## 2. High-Level Architecture

```
┌─────────────────┐      HTTP (REST)       ┌─────────────────┐      Mongoose       ┌─────────────────┐
│    FRONTEND     │  ───────────────────►   │    BACKEND       │  ─────────────────►  │    MongoDB      │
│  React (Vite)   │   GET/POST/PUT/DELETE   │  Express (Node)  │   CRUD operations   │   (Database)    │
│  localhost:5173 │  ◄───────────────────  │  localhost:5000  │  ◄─────────────────  │   (Atlas/local) │
└─────────────────┘      JSON responses   └─────────────────┘                      └─────────────────┘
```

- **Frontend** runs in the browser (Vite dev server on port 5173).
- **Backend** is an Express API on port 5000; it talks to MongoDB via Mongoose.
- **Database** stores tasks as documents in a MongoDB collection.

---

## 3. End-to-End Data Flow

### Example: User Creates a Task

1. **User** fills the form (title, description, status) and clicks “Add Task”.
2. **TaskForm.jsx**  
   - Calls `onSubmit` with `{ title, description, status }`.  
   - That handler lives in **App.jsx** and calls `createTask(task)` from the API service.
3. **services/api.js**  
   - `createTask(task)` sends `POST http://localhost:5000/api/tasks` with a JSON body via axios.
4. **Backend – server.js**  
   - Express receives the request.  
   - CORS and `express.json()` have already run.  
   - The request is matched to the router mounted at `/api/tasks`.
5. **routes/taskRoutes.js**  
   - `POST '/'` is handled by `createTask` from the task controller.
6. **controllers/taskController.js**  
   - `createTask(req, res)` reads `req.body`, calls `Task.create(...)`, then `res.status(201).json(task)`.
7. **models/Task.js**  
   - Mongoose model; `Task.create()` validates the data and inserts a document into MongoDB.
8. **MongoDB**  
   - Stores the new task document (with `_id`, `createdAt`, `updatedAt` from timestamps).
9. **Response path**  
   - Controller → route → Express → HTTP response → axios in the frontend.
10. **Frontend**  
    - App.jsx bumps `refreshTrigger`; TaskList’s `useEffect` runs, calls `getTasks()`, and the list re-renders with the new task.

So the flow is: **UI → App (state/handlers) → API service (axios) → Express → Route → Controller → Model (Mongoose) → MongoDB**, then back as **JSON response → React state → UI**.

The same idea applies for:
- **Read:** `getTasks()` → `GET /api/tasks` → `getAllTasks` → `Task.find()` → JSON array → TaskList renders.
- **Update:** `updateTask(id, task)` → `PUT /api/tasks/:id` → `updateTaskById` → `Task.findByIdAndUpdate()` → JSON → refresh list (and close edit form if open).
- **Delete:** `deleteTask(id)` → `DELETE /api/tasks/:id` → `deleteTaskById` → `Task.findByIdAndDelete()` → refresh list.

---

## 4. Why Each Folder Exists

### Root: `app/`

- **Purpose:** Monorepo root; separates **frontend** and **backend** so each has its own `package.json`, dependencies, and run scripts.
- **Why:** Different runtimes and tooling (React/Vite vs Node/Express); clear boundary for “client” vs “server” when explaining or deploying.

---

### `frontend/`

- **Purpose:** Everything that runs in the browser (React app built with Vite).
- **Why:** Single place for UI, styling, and client-side logic; can be built (`npm run build`) and deployed to a static host or CDN.

**Inside `frontend/`:**

| Item | Why it exists |
|------|----------------|
| **package.json** | Frontend dependencies (react, react-dom, axios) and scripts: `dev`, `build`, `preview`. |
| **vite.config.js** | Vite config: React plugin, dev server port, optional proxy so `/api` can target the backend in dev. |
| **index.html** | Entry HTML; script loads `main.jsx`. Also holds the small theme script so light/dark is applied before React. |
| **src/** | All React source code. |

**Inside `frontend/src/`:**

| Item | Why it exists |
|------|----------------|
| **main.jsx** | Entry point: mounts the React app (e.g. `<App />`) into `#root` and imports global CSS. |
| **App.jsx** | Root component: theme state, create/update handlers, `refreshTrigger`, and layout (header with title + theme toggle, form section, task list section). Wires TaskForm and TaskList. |
| **index.css** | Global styles, CSS variables for light/dark theme, layout (flexbox), cards, buttons, badges, task list. No UI library; everything is custom CSS. |
| **components/** | Reusable UI pieces used by App. |
| **services/** | Code that talks to the backend; no UI. |

**Inside `frontend/src/components/`:**

| File | Responsibility |
|------|----------------|
| **TaskForm.jsx** | Form for add/edit: title, description, status. Validates, calls `onSubmit`, resets form. Used for both create and update (controlled by `initialValues` and `onCancel` in App). |
| **TaskList.jsx** | Fetches tasks on mount and when `refreshTrigger` changes. Renders list, handles delete and status change via API. Passes `onEdit`, `onDelete`, `onStatusChange` to each TaskItem. |
| **TaskItem.jsx** | One task row: title, description, status badge, status dropdown, Edit and Delete buttons. Calls parent handlers with task or id. |

**Inside `frontend/src/services/`:**

| File | Responsibility |
|------|----------------|
| **api.js** | Axios instance with `baseURL: 'http://localhost:5000/api'`. Exposes `getTasks()`, `createTask(task)`, `updateTask(id, task)`, `deleteTask(id)` so components never touch `fetch` or URLs directly. |

---

### `backend/`

- **Purpose:** Node.js server that exposes a REST API and connects to MongoDB.
- **Why:** All task persistence and business logic live here; frontend only sends HTTP requests and displays data.

**Inside `backend/`:**

| Item | Why it exists |
|------|----------------|
| **package.json** | Backend dependencies (express, mongoose, cors, dotenv) and `start` script (`node server.js`). |
| **server.js** | Entry point: loads env, creates Express app, applies CORS and JSON middleware, mounts task routes at `/api/tasks`, starts HTTP server on PORT, connects to MongoDB in the background. |
| **.env** | Local config (not committed): `PORT`, `MONGO_URI`. Loaded by `dotenv` in `server.js`. |
| **.env.example** | Template for `.env`; shows required variables without real secrets. |
| **models/** | Mongoose schemas and models: one collection ↔ one model file. |
| **controllers/** | Request handlers: parse `req`, call model, send `res` with status and JSON. |
| **routes/** | Map URL + method to controller functions; keep server.js thin. |

**Inside `backend/models/`:**

| File | Responsibility |
|------|----------------|
| **Task.js** | Defines task schema (title required, description, status enum with default, timestamps). Exports `mongoose.model('Task', taskSchema)` so the rest of the app uses `Task.create()`, `Task.find()`, etc. |

**Inside `backend/controllers/`:**

| File | Responsibility |
|------|----------------|
| **taskController.js** | `createTask`, `getAllTasks`, `updateTaskById`, `deleteTaskById`. Each is async: reads `req.body`/`req.params`, validates (e.g. ObjectId), calls Task model, handles errors (validation, 404, 500), sends JSON with correct status codes. |

**Inside `backend/routes/`:**

| File | Responsibility |
|------|----------------|
| **taskRoutes.js** | Express router: `POST /` → createTask, `GET /` → getAllTasks, `PUT /:id` → updateTaskById, `DELETE /:id` → deleteTaskById. Mounted in server as `app.use('/api/tasks', taskRoutes)`, so full paths are `/api/tasks` and `/api/tasks/:id`. |

---

## 5. Key Interview Points

- **Separation of concerns:** UI in components, API calls in services, routes in backend, logic in controllers, data shape in models.
- **REST:** Resource “tasks” at `/api/tasks`; GET (read), POST (create), PUT (update), DELETE (delete); JSON in and out.
- **Single source of truth:** Task list comes from the server; frontend refetches after create/update/delete (e.g. via `refreshTrigger` and TaskList’s `getTasks()`).
- **Error handling:** Backend returns 400/404/500 with a message; frontend can show it (e.g. in TaskForm or TaskList).
- **Validation:** Mongoose schema (required, enum) on the backend; optional client-side validation in the form.
- **Theme:** Stored in `localStorage` and applied via `data-theme` on `<html>`; CSS variables in `index.css` define light and dark palettes so contrast is good in both.

You can say: “This is a full-stack CRUD app. The user interacts with the React frontend; the frontend calls the Express API; the API uses Mongoose to read and write tasks in MongoDB. I can walk through the flow for create, read, update, or delete, and explain why we split code into frontend/backend and into components, services, routes, controllers, and models.”
