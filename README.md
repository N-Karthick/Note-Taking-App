Note Taking App

Overview
This is a web application for taking and managing notes. Users can sign up using email with verification and log in to create, view, update, and delete notes.

TECHNOLOGIES USED :

Frontend:
  React
  Material-UI for styling  
  Redux for state management
  Redux Thunk for asynchronous actions
  React Router for navigation

Backend:
  Node.js with Express
  TypeScript for backend development
  MySQL for database storage
  JWT tokens for authentication
  Bcrypt for password hashing

Features
  User Authentication:
  Signup with email verification
  Login with email and password
  JWT token-based authentication

Notes Management:
  Create, read, update, and delete notes
  View a list of all notes
  Edit notes with a form
  Delete notes with confirmation
  
Email Verification:
  Send verification email upon signup
  Verify email address by clicking on the verification link.

Frontend Design:
  Responsive design using Material-UI components
  Dark mode toggle using Switch component
  Success and error message alerts

Backend API: 
RESTful API endpoints for user management and notes CRUD operations
TypeScript for type-safe development
Express middleware for route handling

Database Connectivity:
MySQL database for storing user data and notes
Sequelize ORM for database operations

Security Measures:
Password hashing using bcrypt for secure storage
JWT tokens for authentication and authorization
HTTPS usage for secure communication

Error Handling:
Proper error handling for invalid requests
Error alerts displayed on the frontend
Getting Started

Clone the repository:

git clone https://github.com/your-username/note-taking-app.git
or
download the code in Zip formate and Extract it 
In front End to Start

npm start

For BackEnd to Start

npx tsc - for Compile
nodemon userApiController.ts  - to run the backend code 
