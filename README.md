# Learnify

Learnify is a full-stack online course platform built with the MERN stack and TypeScript. It supports students, instructors, and admins across the full learning workflow: landing page, course discovery, enrollment, lessons, assignments, quizzes, certificates, discussions, announcements, analytics, and platform administration.

## Features

- Authentication with student, instructor, and admin roles
- Role-based route protection on the API
- Course, module, and lesson management
- Course catalog and enrollment flow
- Learning page with lesson completion tracking
- Progress calculation per enrollment
- Multiple-choice quiz flow with backend grading
- Assignment, submission, certificate, discussion, announcement, review, category, enrollment, and audit-log API modules
- Student dashboard for learning progress and quiz results
- Instructor dashboard for course performance and student analytics
- Admin dashboard for users, courses, categories, enrollments, reports, roles, reviews, audit logs, and settings
- Public React landing page based on `docs/ui-landing.html`
- Responsive React UI based on role-specific LMS workflows

## Tech Stack

**Frontend**

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- Recharts
- Lucide React

**Backend**

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas connection string

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnify
MONGODB_DB_NAME=learnify
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SKIP_DB=false
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

`MONGODB_DNS_SERVERS` is optional, but useful when the local Node.js DNS resolver cannot resolve MongoDB Atlas SRV records.

## Installation

```bash
npm install
npm run install:all
```

## Development

```bash
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:5000/api
```

Health check:

```txt
GET http://localhost:5000/api/health
```

## Build

```bash
npm run build
```

This compiles the TypeScript backend and builds the frontend for production.

## Production Start

```bash
npm start
```

The backend starts from the compiled output in `server/dist`.

## Project Scripts

- `npm run dev` - start frontend and backend concurrently
- `npm run install:all` - install dependencies for both apps
- `npm run build` - build backend and frontend
- `npm start` - start the compiled backend

## API Overview

Base URL:

```txt
/api
```

Main route groups:

- `/auth`
- `/courses`
- `/modules`
- `/lessons`
- `/enrollments`
- `/quizzes`
- `/instructor`

## Status

The project is configured for TypeScript development, MongoDB Atlas connectivity, and role-based LMS workflows for student and instructor experiences.
