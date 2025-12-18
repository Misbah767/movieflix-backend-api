# - Advanced Movies App

🎬 MovieFlix is a full-featured movie management and streaming app built with **Node.js**, **Express**, and **MongoDB**.  
It supports **user authentication**, **OTP-based verification**, **password reset**, **role-based access control**, **CRUD operations for movies**, and a **REST API with advanced querying** capabilities including pagination, sorting, searching, filtering using query parameters, and a clean reusable query utility.

---

## 📚 Table of Contents

- [Purpose](#purpose)
- [Features](#features)
- [User Roles & Permissions](#user-roles--permissions)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Movies Flow](#movies-flow)
- [Author](#author)

---

## 🎯 Purpose

CineMaster is designed to provide a **secure and interactive movie platform** with features for both **Users** and **Admins**, including:

- Secure login, registration, and logout
- OTP-based account verification
- Forgot password via OTP
- Role-based access control (Admin/User)
- CRUD operations for movies (Admin)
- View and search movies (Users)
- Protected routes accessible only by authorized roles
- Real-time email notifications for verification and password reset

---

## Features

### 🔑 User Authentication & Authorization

- JWT-based authentication (`accessToken` + `refreshToken`)
- Login, Register, Logout
- OTP-based account verification via email
- Password reset via email OTP
- Secure password hashing using bcrypt

### 🛡️ Role-Based Access Control (RBAC)

- `Admin` and `User` roles
- Role-specific access to protected routes
- Admin can manage movies
- Users can browse and view movies
- Admin and User dashboards separated

### 🎬 Movie Management (Admin)

- Create new movies with title, genre, language, release year, and publish status
- Update existing movies
- Delete movies
- Retrieve single or all movies

### 👤 User Management

- Users can view and update their profiles
- Admin can manage users (CRUD operations)

### 📧 Email & Notifications

- OTP for account verification
- OTP for password reset
- Confirmation emails after account verification and password reset

### 🔐 Security

- Protected routes using `userAuth` middleware
- Role-based access using `roleAuth` middleware
- JWT verification and expiration handling
- Error handling for unauthorized or forbidden access

---

## User Roles & Permissions

| Role      | Browse Movies | Manage Movies | Profile Management | Protected Routes |
| --------- | ------------- | ------------- | ------------------ | ---------------- |
| **Admin** | ✅            | ✅            | ✅                 | ✅               |
| **User**  | ✅            | ❌            | ✅                 | ✅               |

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, Refresh Tokens
- **Email:** Nodemailer (OTP & verification)
- **Validation:** Joi
- **Security:** bcrypt, password hashing

---

## Setup & Installation

### 1️⃣ Clone the repository

git clone https://github.com/Misbah767/CineMaster.git
cd CineMaster
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Configure environment variables
Create a .env file in the root directory:

env
Copy code
MONGODB_URL=mongodb://localhost:27017/cinemaster
JWT_SECRET=<your-secret-key>
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=<your-smtp-user>
SMTP_PASS=<your-smtp-password>
4️⃣ Run the development server
bash
Copy code
npm run dev
Server starts at http://localhost:5000

API Endpoints
Public Routes
Endpoint Method Description
/api/auth/register POST Register a new user (requires OTP)
/api/auth/login POST Login and receive JWT tokens
/api/auth/verify-account POST Verify account via OTP
/api/auth/resend-account-otp POST Resend OTP
/api/auth/forgot-password POST Request password reset OTP
/api/auth/verify-reset-otp POST Verify reset OTP
/api/auth/resend-reset-otp POST Resend OTP for password reset
/api/auth/reset-password POST Reset password after OTP verification

Protected Routes (Admin/User)
Endpoint Method Roles Allowed Description
/api/users/profile GET Admin/User Fetch user profile
/api/users/profile PUT Admin/User Update user profile
/api/auth/logout POST Admin/User Logout and revoke refresh token
/api/auth/refresh POST Admin/User Refresh access token

Movie Routes
Endpoint Method Roles Allowed Description
/api/movies GET All Get all movies
/api/movies/:id GET All Get single movie by ID
/api/movies POST Admin Create new movie
/api/movies/:id PUT Admin Update existing movie
/api/movies/:id DELETE Admin Delete movie

---

Authentication Flow
Registration
User provides name, email, and password.

Server hashes password and stores user in DB.

OTP sent via email for verification.

Account Verification
User submits OTP received via email.

Server validates OTP and activates account.

Login
User provides credentials.

Server verifies credentials and returns accessToken + refreshToken.

Protected Routes
userAuth middleware validates JWT.

roleAuth enforces role-based access.

Forgot Password
User requests OTP via email.

After OTP verification, user resets password.

Movies Flow
Browse Movies (Users)
Users can fetch all movies or search by ID.

Users see only published movies.

Manage Movies (Admin)
Admin can create, update, and delete movies.

Admin can publish/unpublish movies.

Author
Hafiza Misbah

```

```
