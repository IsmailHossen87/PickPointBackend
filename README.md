
# 📌 Tour Management System - Backend

This is a **Tour Management System Backend** built with **Express.js, TypeScript, Passport.js, MongoDB, and Zod Validation**.  
The project follows a **modular architecture** for better scalability and maintainability.  

---

## 🚀 Features
- 🔐 Authentication (Email/Password, Google OAuth, OTP-based login)  
- 👤 User Management (Admin, Super Admin, Normal User)  
- 🌍 Division Management with Image Upload (Multer)  
- 🏞️ Tour & Tour Type Management (CRUD)  
- 📑 Booking System (Create, View, Update Booking Status)  
- 💳 Payment Gateway Integration (Success, Fail, Cancel, Invoice Download)  
- 📊 Stats for Admin (Booking, Payment, User, Tour)  
- ✉️ Forgot/Reset Password with Email & Token  
- 🛡️ Role-based Authorization  

---

## 🛠️ Tech Stack
- **Backend Framework:** Express.js + TypeScript  
- **Authentication:** Passport.js (Google OAuth, Session-based Auth, JWT)  
- **Validation:** Zod  
- **Database:** MongoDB with Mongoose  
- **File Upload:** Multer  
- **Payment:** Payment Gateway Integration  
- **Session Management:** express-session  
- **Others:** CORS, Cookie-Parser  

---

## 📂 Project Structure
```
src/
 ├── app/
 │   ├── config/        # Environment, Passport, Multer configs
 │   ├── middlewares/   # Middlewares (checkAuth, errorHandler, etc.)
 │   ├── modules/       # Feature-based modules (auth, booking, division, etc.)
 │   ├── routes/        # Centralized routes
 │   └── utils/         # Utility functions
 ├── index.ts           # Entry point
 └── app.ts             # Express app config
```

---

## 🔑 Default Super Admin Credentials
```
Email: super@gmail.com
Password: 12345678
```

---

## ⚡ API Endpoints

### 🔐 Auth Routes (`/api/v1/auth`)
- `POST /login` - Login with credentials  
- `POST /refresh-token` - Get new access token  
- `POST /logout` - Logout  
- `POST /change-password` - Change user password  
- `POST /set-password` - Set password for new users  
- `POST /forgot-password` - Forgot password (send reset link)  
- `POST /reset-password` - Reset password  
- `GET /google` - Google login  
- `GET /google/callback` - Google OAuth callback  

### 👤 User Routes (`/api/v1/user`)
- `POST /register` - Register user  
- `GET /all-users` - Get all users (Admin only)  
- `GET /me` - Get logged-in user profile  
- `GET /:id` - Get single user (Admin only)  
- `PATCH /:id` - Update user info  

### 🏞️ Tour Routes (`/api/v1/tour`)
- `GET /` - Get all tours  
- `POST /create` - Create a new tour (Admin)  
- `GET /:slug` - Get tour by slug  
- `PATCH /:id` - Update tour (Admin)  
- `DELETE /:id` - Delete tour (Admin)  

### 🗂️ Division Routes (`/api/v1/division`)
- `POST /create` - Create division (Admin)  
- `GET /` - Get all divisions  
- `GET /:slug` - Get single division  
- `PATCH /:id` - Update division (Admin)  
- `DELETE /:id` - Delete division (Admin)  

### 📑 Booking Routes (`/api/v1/booking`)
- `POST /` - Create booking  
- `GET /` - Get all bookings (Admin only)  
- `GET /my-bookings` - Get logged-in user bookings  
- `GET /:bookingId` - Get single booking  
- `PATCH /:bookingId/status` - Update booking status  

### 💳 Payment Routes (`/api/v1/payment`)
- `POST /init-payment/:bookingId` - Initialize payment  
- `POST /success` - Payment success callback  
- `POST /fail` - Payment fail callback  
- `POST /cancel` - Payment cancel callback  
- `GET /invoice/:paymentId` - Get invoice (Authenticated)  
- `POST /validate-payment` - Validate payment  

### ✉️ OTP Routes (`/api/v1/otp`)
- `POST /send` - Send OTP  
- `POST /verify` - Verify OTP  

### 📊 Stats Routes (`/api/v1/stats`)
- `GET /booking` - Booking stats (Admin only)  
- `GET /payment` - Payment stats (Admin only)  
- `GET /user` - User stats (Admin only)  
- `GET /tour` - Tour stats (Admin only)  

---

## ▶️ Getting Started

### 1️⃣ Clone repo
```bash
git clone https://github.com/IsmailHossen87/PickPointBackend
cd PickPointBackend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 4️⃣ Run in Dev mode
```bash
npm run dev
```

### 5️⃣ Build & Run in Prod
```bash
npm run build
npm start
```

---

## 📜 License
This project is licensed under the **MIT License**.
