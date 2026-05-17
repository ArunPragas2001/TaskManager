Task Manager API

Project Overview

The Task Manager API is a backend application developed to help users
manage their daily tasks in an organized and efficient way. This system
allows users to create, view, update, and delete tasks easily through
REST API endpoints.

The project is built using Node.js, Express.js, and MongoDB, following
the CRUD (Create, Read, Update, Delete) concept commonly used in modern
web development.

------------------------------------------------------------------------

Problem Description

Managing tasks manually can often become confusing and time-consuming.
People may forget important deadlines, lose track of pending work, or
struggle to organize multiple activities properly.

------------------------------------------------------------------------

Proposed Solution

This Task Manager API provides a simple digital solution for managing
tasks effectively. Users can store task details such as title, deadline,
and status in a database and perform different operations like adding,
updating, viewing, and deleting tasks whenever needed.

------------------------------------------------------------------------

Features

-   Create new tasks
-   View all saved tasks
-   Update task information
-   Delete tasks
-   Store deadlines for tasks
-   Manage task status (pending/completed)
-   RESTful API architecture
-   MongoDB database integration
-   Error handling and validation

------------------------------------------------------------------------

Technologies Used

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   dotenv
-   Postman

------------------------------------------------------------------------

API Endpoints

1. Create Task

Method: POST
Endpoint: /api/tasks/create

Example Request: { “title”: “Finish assignment”, “deadline”:
“2026-05-10”, “status”: “pending” }

------------------------------------------------------------------------

2. Get All Tasks

Method: GET
Endpoint: /api/tasks/

------------------------------------------------------------------------

3. Update Task

Method: PUT
Endpoint: /api/tasks/:id

Example Request: { “status”: “completed” }

------------------------------------------------------------------------

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

------------------------------------------------------------------------

Setup Instructions

Step 1: Clone the Repository

git clone

Step 2: Navigate to the Project Folder

cd task-manager

Step 3: Install Required Dependencies

npm install

Step 4: Create Environment Variables

Create a .env file in the root directory and add the following:

PORT=8000 MONGO_URL=your_mongodb_connection_string

------------------------------------------------------------------------

How to Run the Project

Start the server using:

npm start

The server will run on: http://localhost:8000

------------------------------------------------------------------------

Conclusion

This project demonstrates the implementation of a RESTful API using
Node.js, Express.js, and MongoDB. It provides a practical solution for
managing tasks efficiently while also helping developers understand
backend development concepts such as routing, database operations, and
API handling.

------------------------------------------------------------------------

Author

Arun Pragas(2022ICT90)
git clone https://github.com/ArunPragas2001/TaskManager.git
