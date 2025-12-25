# 📘 THE MONGODB MASTERCLASS BIBLE
**Project:** ProTasker (MERN Stack Task Manager)
**Author:** Antigravity (for You)
**Date:** December 2025

---

## 🧐 1. The "Big Picture" Architecture
We built a **Monorepo** (One folder, two projects). This is how professional Full-Stack apps are structured.

```mermaid
graph LR
    subgraph "Client (Frontend)"
        React[React App (Vite)]
        AuthCtx[Auth Context]
        Dash[Dashboard UI]
    end

    subgraph "Back (Backend API)"
        Express[Express Server]
        Router[Router /api/...]
        Controller[Controllers]
        Model[Mongoose Models]
        DB[(MongoDB Atlas)]
    end

    React <-->|Axios (JSON)| Express
    Express --> Router --> Controller --> Model <--> DB
```

---

## 🛠️ 2. The Tech Stack (What & Why)

| Technology | Why we used it? |
| :--- | :--- |
| **Node.js** | The runtime to run JS outside the browser. |
| **Express** | The framework to build APIs easily (Routing, Middleware). |
| **MongoDB** | The NoSQL Database. Flexible, fast, & JSON-like. |
| **Mongoose** | The "Bodyguard". Enforces Schemas on unstructured Mongo. |
| **JWT** | "JSON Web Token". The secure ID card for users (Stateless). |
| **Bcrypt** | Encryption tool. Turns "password123" into gibberish. |
| **Vite + React**| The modern standard for building fast frontends. |

---

## 📂 3. Project Structure (The "Pro" Standard)

We moved away from a single `index.js` file to a **MVC (Model-View-Controller)** pattern.

### `back/` (The Server)
*   **`config/db.js`**:
    *   **Concept**: Singleton Pattern. Connects to DB once.
    *   **Key Code**: `mongoose.connect(process.env.MONGO_URI)`
*   **`models/`**:
    *   **Concept**: Schemas. Defining the shape of data.
    *   **Files**: `User.js` (Auth), `Task.js` (Data).
*   **`controllers/`**:
    *   **Concept**: Business Logic. "What happens when I click X?"
    *   **Files**: `authController.js` (Login/Reg), `taskController.js` (CRUD).
*   **`middleware/`**:
    *   **Concept**: The Bouncer. Intercepts requests before the Controller.
    *   **Files**: `auth.js` (`protect` function checks JWT).
*   **`routes/`**:
    *   **Concept**: The Map. Tells the server which URL goes to which Controller.

### `client/` (The Frontend)
*   **`src/context/AuthContext.jsx`**:
    *   **Concept**: Global State. Keeps the user logged in across pages.
*   **`src/pages/`**: The detailed screens (Login, Register, Dashboard).

---

## 🔑 4. Authentication (The Hardest Part Explained)

We implemented **Stateless Authentication** using **JWTs stored in Cookies**.

### The Flow
1.  **Register**: User sends `email` + `password`.
2.  **Hash**: Server uses `bcrypt` to scramble the password.
    *   `password123` -> `$2a$10$Xy7...`
3.  **Save**: Scrambled password saved to MongoDB.
4.  **Login**: User sends `email` + `password`.
5.  **Compare**: Server hashes input and compares with DB.
6.  **Sign**: If match, Server creates a **JWT** (contains User ID).
7.  **Cookie**: Server sends JWT back in a `httpOnly` cookie (cannot be stolen by JS).

```mermaid
sequenceDiagram
    participant User
    participant Server
    participant DB
    
    User->>Server: Login (Email/Pass)
    Server->>DB: Find User
    DB-->>Server: User Found (Hashed Pass)
    Server->>Server: Compare Passwords
    Server->>Server: Sign JWT
    Server-->>User: Set-Cookie: token=JWT...
```

---

## 📉 5. Advanced MongoDB Concepts

### A. Virtuals ("Reverse Populate")
We didn't want to store an array of 1000 Task IDs in the User document.
**Solution**: We told Mongoose, *"Hey, if I ask for 'tasks', go look in the Task collection for anything with my ID."*
```javascript
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
});
```

### B. Aggregation Pipeline
We built a `/api/stats` endpoint. Instead of "finding and counting in JS" (slow), we used Mongo's calculation engine.
1.  **$match**: Filter.
2.  **$group**: Group by Status.
3.  **$sort**: Order them.

---

## ⚙️ 6. Configuration & Secrets (ENV)

**WARNING**: Keep this safe. Do not commit to GitHub public repos.

**File**: `back/.env`
```env
MONGO_URI=mongodb+srv://samratrex999_db_user:8427339216@stashpro999.opbiy51.mongodb.net/pro_tasker_db?appName=StashPro999
PORT=5000
JWT_SECRET=supersecretsecret123
JWT_EXPIRE=30d
```

---

## 🔌 7. API Reference (Cheatsheet)

**Base URL**: `http://localhost:5000`

### Auth
| Method | Endpoint | Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | `{name, email, password}` | Creates user & cookie |
| `POST` | `/api/auth/login` | `{email, password}` | Log in & get cookie |
| `GET` | `/api/auth/me` | *None* | Get my details (uses cookie) |

### Tasks
| Method | Endpoint | Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | *None* | Get my tasks |
| `POST` | `/api/tasks` | `{title, status}` | Create new task |
| `PUT` | `/api/tasks/:id` | `{status}` | Update task |
| `DELETE` | `/api/tasks/:id` | *None* | Delete task |

---

## 🚀 8. How to Run (The Manual)

**Step 1: Start the Backend**
```bash
cd back
npm start
```

**Step 2: Start the Frontend**
```bash
cd client
npm run dev
```

**Step 3: Open Browser**
Go to `http://localhost:5173`
