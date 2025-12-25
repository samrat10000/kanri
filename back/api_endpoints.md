# ProTasker API Endpoints
Base URL: `http://localhost:5000`

## 1. Authentication
**Register a new user**
*   **Method**: `POST`
*   **URL**: `http://localhost:5000/api/auth/register`
*   **Body (JSON)**:
    ```json
    {
      "name": "Samrat",
      "email": "samrat@example.com",
      "password": "password123",
      "role": "user"
    }
    ```

**Login**
*   **Method**: `POST`
*   **URL**: `http://localhost:5000/api/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "samrat@example.com",
      "password": "password123"
    }
    ```

**Get Current Profile** (Requires Login first)
*   **Method**: `GET`
*   **URL**: `http://localhost:5000/api/auth/me`

---

## 2. Tasks (CRUD)
*Note: You must be logged in to use these.*

**Create a Task**
*   **Method**: `POST`
*   **URL**: `http://localhost:5000/api/tasks`
*   **Body (JSON)**:
    ```json
    {
      "title": "Finish MongoDB Course",
      "description": "Watch all the modules and build the project",
      "status": "in-progress",
      "dueDate": "2023-12-31"
    }
    ```

**Get All Tasks**
*   **Method**: `GET`
*   **URL**: `http://localhost:5000/api/tasks`

**Get Tasks (with Pagination & Filter)**
*   **Method**: `GET`
*   **URL**: `http://localhost:5000/api/tasks?status=pending&page=1&limit=5`

**Update a Task**
*   **Method**: `PUT`
*   **URL**: `http://localhost:5000/api/tasks/INSERT_TASK_ID_HERE`
*   **Body (JSON)**:
    ```json
    {
      "status": "completed"
    }
    ```

**Delete a Task**
*   **Method**: `DELETE`
*   **URL**: `http://localhost:5000/api/tasks/INSERT_TASK_ID_HERE`

---

## 3. Analytics
**Get Stats**
*   **Method**: `GET`
*   **URL**: `http://localhost:5000/api/stats`
