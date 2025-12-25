# MongoDB Masterclass: From Zero to Hero
**Project**: ProTasker API (A production-ready Task Management System)

## Phase 1: Foundation & Core Features
- [x] **Module 1: Professional Setup & Connection** <!-- id: 1 -->
    - [x] Initialize Node.js project & Install dependencies (mongoose, express, dotenv)
    - [x] Create production-grade folder structure
    - [x] Implement robust Database Connection (Singleton pattern, Error handling)
    - [x] Explain: Connection Pools, URI security, Debug mode
- [x] **Module 2: Schemas, Types & Validation** <!-- id: 2 -->
    - [x] Design `User` Schema (Validation, Default values, Indexing)
    - [x] Design `Task` Schema (Enums, Dates, Relationships)
    - [x] Explain: BSON types, Schema vs Schema-less, Validation best practices
- [x] **Module 3: The CRUD of the Job** <!-- id: 3 -->
    - [x] Implement Create (InsertOne vs InsertMany, Error handling)
    - [x] Implement Read (Find, Queries, Projections, Pagination - Vital!)
    - [x] Implement Update (UpdateOne, $set, $push, $inc)
    - [x] Implement Delete (Soft delete vs Hard delete)
- [x] **Module 4: Advanced Indexing & Performance** <!-- id: 4 -->
    - [x] Create Compound Indexes for common queries
    - [x] Explain: Execution Stats, Index utilization, Unique constraints
- [x] **Module 5: Aggregation Framework (The Data Science)** <!-- id: 5 -->
    - [x] Build Analytics Endpoint (Users stats, Tasks completion rates)
    - [x] Explain: Stages ($match, $group, $project, $lookup), Pipelines
- [x] **Module 6: Security & Production Readiness** <!-- id: 6 -->
    - [x] Implementation Injection Protection (Sanitization)
    - [x] Final Review & Best Practices Checklist

## Phase 2: Professional Identity (Auth & Logic)
- [x] **Module 7: Authentication (JWT & Cookies)** <!-- id: 7 -->
    - [x] Explain: Stateless vs Stateful Auth, JWT structure
    - [x] Implement: User Registration (hashing passwords with bcrypt)
    - [x] Implement: User Login (generating tokens)
- [x] **Module 8: Authorization Middleware** <!-- id: 8 -->
    - [x] Create `protect` middleware to lock routes
    - [x] Update Task Controller to specific user's data (Data Isolation)
- [x] **Module 9: Advanced Concepts (Virtuals & Methods)** <!-- id: 9 -->
    - [x] Add "Reverse Populate" (Show tasks inside User object)
    - [x] Add Custom Methods (e.g., `user.matchPassword()`)

## Phase 3: The Frontend (Real World Usage)
- [x] **Module 10: Connecting Frontend to Backend (CORS)** <!-- id: 10 -->
    - [x] Explain: Same-Origin Policy & CORS
    - [x] Action: Enable `cors` on server
- [x] **Module 11: The React Client** <!-- id: 11 -->
    - [x] Scaffold Vite React App
    - [x] Build Login UI (Auth Flow)
    - [x] Build Task Dashboard (Consume CRUD APIs)

## Phase 4: Structural Refactor (Clean Code)
- [x] **Module 12: Separation of Concerns** <!-- id: 12 -->
    - [x] Create `back` folder and move all server logic there.
    - [x]  Ensure `client` folder is totally separate.
    - [x] Verify both can run independently.

## Phase 5: Feature Expansion (Learning by Doing)
- [/] **Feature 1: Task Priorities** <!-- id: 13 -->
    - [x] Update Schema: Add `priority` (Low, Medium, High).
    - [x] Update UI: Add Selector to Dashboard.
    - [x] Update UI: Visualize Priority (Colors).
    - [x] **Artifact**: `FEATURE_PRIORITY.md` (Diagrams & Code).

- [x] **Feature 5: Edit Task** <!-- id: 17 -->
    - [x] Update UI: Add Edit Button to Task Card.
    - [x] Update Logic: Populate Form with Task Data.
    - [x] Update Logic: Send `PUT` Request.
    - [x] **Artifact**: Update `FEATURES_LOG.md`.

- [x] **Feature 4: Due Dates** <!-- id: 16 -->
    - [x] Update UI: Add Date Picker.
    - [x] Update Logic: Send `dueDate` to Backend.
    - [x] Update UI: Highlight Overdue Tasks.
    - [x] **Artifact**: Update `FEATURES_LOG.md`.

- [x] **Feature 6: Data Analytics** <!-- id: 18 -->
    - [x] Update UI: Fetch `/api/stats`.
    - [x] Update UI: Display "Stats Cards" (Total, Pending, Completed).
    - [x] **Artifact**: Update `FEATURES_LOG.md`.

- [x] **Feature 7: Dark Mode** <!-- id: 19 -->
    - [x] Update UI: Add Theme Context & Toggle.
    - [x] Update CSS: Implement Variables.
    - [x] **Artifact**: Update `FEATURES_LOG.md`.

- [x] **Feature 8: Real-Time Search** <!-- id: 20 -->
    - [x] Backend: Add Regex logic to `taskController.js`.
    - [x] Frontend: Add Search Input with Debounce.
    - [x] **Artifact**: Update `FEATURES_LOG.md`.

- [x] **Feature 9: Kanban Board** <!-- id: 21 -->
    - [x] Install drag-and-drop library (`@dnd-kit`).
    - [x] Create column-based layout (Pending, In Progress, Completed).
    - [x] Implement drag-and-drop functionality.
    - [x] Update task status on drop.
    - [x] **Artifact**: Update `FEATURES_LOG.md`.

- [x] **Feature 10: Lofi Music Player (Tokyo Inspired)** <!-- id: 22 -->
    - [x] Design floating music widget component.
    - [x] Integrate YouTube lofi streams.
    - [x] Add anime-style controls (play/pause, volume).
    - [x] Implement minimized/expanded states.
    - [x] **Artifact**: Update `FEATURES_LOG.md` & `CHANGE_LOG.md`.

- [x] **Feature 11: Pomodoro Focus Timer** <!-- id: 23 -->
    - [x] Create timer component with countdown logic.
    - [x] Implement 25min work / 5min break cycles.
    - [x] Add start/pause/reset controls.
    - [x] Add sound notification on completion.
    - [x] Track completed sessions counter.
    - [x] **Artifact**: Update `FEATURES_LOG.md` & `CHANGE_LOG.md`.

- [x] **Feature 12: Sakura Celebration (Tokyo Inspired)** <!-- id: 24 -->
    - [x] Create falling cherry blossom animation.
    - [x] Add Japanese motivational quotes on completion.
    - [x] Trigger on task completion and pomodoro sessions.
    - [x] Add celebration sound effect.
    - [x] **Artifact**: Update `FEATURES_LOG.md` & `CHANGE_LOG.md`.

- [x] **Feature 13: Japanese Time Greetings** <!-- id: 25 -->
    - [x] Add time detection logic.
    - [x] Display appropriate Japanese greeting.
    - [x] Show romaji and English translation.
    - [x] **Artifact**: Update `FEATURES_LOG.md` & `CHANGE_LOG.md`.

- [x] **Feature 14: Focus Mode (Zen Productivity)** <!-- id: 26 -->
    - [x] Create dimmed overlay component.
    - [x] Add toggle button to header.
    - [x] Display focus message in Japanese.
    - [x] Add keyboard shortcut (Escape to exit).
    - [x] **Artifact**: Update `FEATURES_LOG.md` & `CHANGE_LOG.md`.

- [x] **Feature 15: Quick Stats Widget** <!-- id: 27 -->
    - [x] Create floating widget component.
    - [x] Track today's completed tasks.
    - [x] Implement streak counter with localStorage.
    - [x] Add weekly overview stats.
    - [x] **Artifact**: Update `FEATURES_LOG.md` & `CHANGE_LOG.md`.

- [x] **Feature 16: Traditional Japanese Color Themes** <!-- id: 28 -->
    - [x] Create 5 Edo-period color palettes (Sakura, Matcha, Indigo, Momiji, Sumi).
    - [x] Extend ThemeContext with theme definitions.
    - [x] Add theme selector dropdown to navbar.
    - [x] Persist theme choice in localStorage.
    - [x] **Artifact**: Update `FEATURES_LOG.md` & `CHANGE_LOG.md`.

- [x] **Feature 2: Smart Filters** <!-- id: 14 -->
    - [x] Update UI: Add Filter Buttons (Status & Priority).
    - [x] Update Logic: Send Query Params to Backend.
    - [x] **Artifact**: Update `FEATURES_LOG.md`.

- [x] **Feature 3: Sorting** <!-- id: 15 -->
    - [x] Update UI: Add Sort Dropdown (Newest, Oldest, A-Z).
    - [x] Update Logic: Send `sort` param to Backend.
    - [x] **Artifact**: Update `FEATURES_LOG.md`.
