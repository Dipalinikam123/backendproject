# User API

This is a Node.js API for managing users. It provides endpoints for creating, updating, retrieving, and deleting user accounts, as well as authentication and password management features.

## Table of Contents

- [Technologies Used]
- [Installation]
- [API Endpoints]
  - [Create User]
  - [Login User]
  - [Get All Users]
  - [Get User by ID]
  - [Update User]
  - [Update Password]
  - [Forgot Password]
  - [Reset Password]
  - [Delete User]
- [Error Handling]

## Technologies Used

- **Node.js**: A JavaScript runtime used for building the server-side application.
- **Express.js**: A web application framework for Node.js, used for creating the API endpoints and handling requests.
- **MongoDB**: A NoSQL database used for storing user information (you can replace this with your specific database if different).
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB, used to manage data and models.
- **JWT (JSON Web Tokens)**: Used for securely transmitting user information for authentication and authorization.
- **Bcrypt**: A library for hashing and securely storing passwords.
- **dotenv**: Used to manage environment variables, such as the JWT secret key and database URI.
- **Nodemailer** (optional): For sending emails, especially for password reset or other notifications.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dipalinikam123/backendproject.git

   ```

2. Install dependencies:

   ```terminal
   npm install

   ```

3. Start the server:
   npm start

## API Endpoints

Create User:-
**Endpoint**: `POST /auth/sign-up`

Login User:-
**Endpoint**: `POST /auth/sign-in`

Get All User:-
**Endpoint**: `GET /users`

Get User By Id:-
**Endpoint**: `GET /users/:id`

Update User By Id:-
**Endpoint**: `PUT /users/:id`

Delete User By Id:-
**Endpoint**: `DELETE /users/:id`

update Password By Id:-
**Endpoint**: `POST /users/update-password/:id`

Forgot password:-
**Endpoint**: `POST /auth/forget-password`

Reset PAssword:-
**Endpoint**: `POST /users/reset-password/:id/:token`

## Error Handling

This API handles errors by returning appropriate HTTP status codes and messages. Ensure to check the response body for error details.
