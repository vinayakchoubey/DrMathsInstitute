# Dr Maths Institute LMS

## Project Structure
- **Frontend**: Next.js App Router (Port 3000)
- **Backend**: Express + MongoDB (Port 5000)

## Prerequisites
- Node.js
- MongoDB (Running locally or update URI in `.env`)
- Cloudinary Account (Update `.env` in Backend)

## How to Run

### 1. Backend
Navigate to `Backend` folder:
```bash
cd Backend
npm install
npm run dev
```

### 2. Frontend
Navigate to `Frontend` folder:
```bash
cd Frontend
npm install
npm run dev
```

## Admin Access
- Sign up a new user.
- Manually update the user's role to `admin` in MongoDB used for testing (Use MongoDB Compass or Shell).
- `db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })`

## Features
- **Authentication**: Secure Login/Signup.
- **Role Based Access**: Admin & Client dashboards.
- **Courses**: Admin can create courses with multiple content items (PDF/Video).
- **Payment**: Mock payment flow adds courses to user profile.
- **About**: Admin managed About section.
- **Theme**: Premium Dark/Light mode design.
