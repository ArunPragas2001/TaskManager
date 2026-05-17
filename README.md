<div align="center">
  
# 🚀 Task Manager API

**A secure, robust RESTful API for managing personal tasks — built with Node.js, Express.js, and MongoDB.**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## 📌 Overview

The **Task Manager API** is a backend application that enables users to manage their daily tasks efficiently through secure REST API endpoints. Users can register, authenticate, and perform full **CRUD** (Create, Read, Update, Delete) operations on their tasks. It features deadline tracking, priority levels, and status updates, all protected by secure JWT authentication.

---

## ✨ Key Features

- **🔐 Secure Authentication:** User registration and login utilizing JSON Web Tokens (JWT).
- **📋 Comprehensive Task Management:** Create, view, update, and delete tasks.
- **🏷️ Smart Categorization:** Assign priorities (`High`, `Medium`, `Low`) and track status (`pending`, `completed`).
- **⏳ Deadline Tracking:** Set precise deadlines to never miss an important task.
- **🛡️ Data Integrity:** Strict input validation and robust error handling.

---

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Security:** JSON Web Token (JWT)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArunPragas2001/TaskManager.git
   cd TaskManager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=8000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   > 🌐 **Server runs at:** `http://localhost:8000`

---

## 🔗 API Reference

### 🔑 Authentication

| Method | Endpoint | Description | Requires Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user & get JWT token | ❌ |

**Login Example (Response):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5c..."
}
```
> *Save this token! You will need to pass it in the `Authorization` header as a `Bearer Token` for all task-related endpoints.*

### 📝 Tasks

<<<<<<< HEAD
| Method | Endpoint | Description | Requires Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/tasks/create` | Create a new task | ✅ |
| `GET`  | `/api/tasks/` | Retrieve all tasks for the logged-in user | ✅ |
| `PUT`  | `/api/tasks/:id` | Update a specific task | ✅ |
| `DELETE`| `/api/tasks/:id` | Delete a specific task | ✅ |

**Task Object Example:**
```json
{
  "title": "Complete backend integration",
  "deadline": "2026-05-20",
  "status": "pending",
  "priority": "High"
}
```
=======
4. Delete Task
 Method: DELETE
 Endpoint: /api/tasks/:id
------------------------------------------------------------------------

5. Register user
 Method: POST
 Endpoint: /api/auth/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "createdAt": "2026-05-17T10:30:00.000Z"
}
>>>>>>> 6bab906e21969833e988a697496cdbf56ec41527

---

## 🧪 Testing with Postman

To successfully test the API, follow this workflow:

1. **Register** a user (`POST /api/auth/register`).
2. **Login** (`POST /api/auth/login`) and **copy the JWT token** from the response.
3. For all `/api/tasks/*` requests, navigate to the **Authorization** tab in Postman.
4. Select **Bearer Token** from the dropdown menu.
5. Paste your token into the field.
6. When updating or deleting, use the `_id` retrieved from the `GET /api/tasks/` response.

---

## 📁 Project Structure

```text
TaskManager/
├── controllers/       # Route logic (authController.js, taskControllers.js)
├── middleware/        # Custom middleware (authMiddleware.js)
├── models/            # Mongoose schemas (userModel.js, taskModel.js)
├── routes/            # Express routes (authRoutes.js, taskRoutes.js)
├── .env               # Environment variables
├── index.js           # Entry point
└── package.json       # Project metadata and dependencies
```

---

## 👨‍💻 Author

**Arun Pragas** (2022ICT90)

[![GitHub](https://img.shields.io/badge/GitHub-ArunPragas2001-181717?style=for-the-badge&logo=github)](https://github.com/ArunPragas2001/TaskManager)
