Task Manager API
================

Welcome to the Task Manager API! This is a simple backend application built with Node.js, Express.js, and MongoDB. It allows users to register, log in, and manage their daily tasks.

Features
--------

- User Accounts: Register and log in securely.
- Manage Tasks: Create, view, update, and delete your tasks.
- Task Details: Set a title, deadline, priority (High, Medium, Low), and status (pending, completed).

Technology Stack
----------------

- Node.js & Express.js (Backend server)
- MongoDB (Database)
- JSON Web Tokens (Security/Login)

How to Set It Up
----------------

To run this project on your own computer, follow these simple steps:

1. Download the code:
   Clone the repository to your computer.
   ```bash
   git clone https://github.com/ArunPragas2001/TaskManager.git
   cd TaskManager
   ```

2. Install what you need:
   Run this command to download the required packages.
   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a new file named .env in the main folder. Add these lines to it (replace with your own details):
   ```env
   PORT=8000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_password
   ```

4. Start the app:
   ```bash
   npm start
   ```
   Your app will start running at http://localhost:8000.

API Endpoints
-------------

Here are the links (endpoints) you can use to talk to the application.


1. USER AUTHENTICATION (NO LOGIN REQUIRED)

- Register a new user
  - Method: POST
  - Link: /api/auth/register
  - Example data to send:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```

- Log in
  - Method: POST
  - Link: /api/auth/login
  - Example data to send:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
  - Important: When you log in, you will get a token. Save this token! You need it to manage your tasks.


2. TASK MANAGEMENT (LOGIN REQUIRED)

Note: For all these links, you must provide your login token in the headers.

- Create a new task
  - Method: POST
  - Link: /api/tasks/create
  - Example data to send:
    ```json
    {
      "title": "Do homework",
      "deadline": "2026-05-20",
      "status": "pending",
      "priority": "High"
    }
    ```

- View all your tasks
  - Method: GET
  - Link: /api/tasks/
  - Example data to send:
    ```text
    No data needed! Just send the GET request and it will return a list of all your tasks.
    ```

- Update a task
  - Method: PUT
  - Link: /api/tasks/:id (Replace :id with your task's ID)
  - Example data to send (only include what you want to change):
    ```json
    {
      "title": "Do homework quickly",
      "status": "completed",
      "priority": "Medium"
    }
    ```

- Delete a task
  - Method: DELETE
  - Link: /api/tasks/:id (Replace :id with your task's ID)
  - Example data to send:
    ```text
    No data needed! Just send the DELETE request to remove the task.
    ```

How to Test with Postman
------------------------

1. Open Postman.
2. Use the Register link to create a user.
3. Use the Log in link to log in. Copy the token from the response.
4. Open a new request for tasks (like Create or View).
5. Go to the Authorization tab, select Bearer Token, and paste your token there.
6. Click send!

Author
------

Arun Pragas (2022ICT90)
