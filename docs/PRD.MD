# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# Learnify — Learning Management System

## 1. Project Overview

**Project Name:** Learnify  
**Project Type:** Learning Management System (LMS)  
**Platform:** Web Application  
**Architecture:** MERN Stack  
**Target Users:** Student dan Instructor

Learnify adalah Learning Management System berbasis web yang memungkinkan instructor membuat dan mengelola course, materi pembelajaran, serta quiz. Student dapat melakukan enrollment pada course, mempelajari materi, mengerjakan quiz, dan memantau progress pembelajaran.

Project ini dirancang sebagai aplikasi full-stack menggunakan MERN Stack dengan REST API sebagai komunikasi antara frontend dan backend.


---

# 2. Objectives

Tujuan utama sistem:

1. Menyediakan platform pembelajaran online berbasis web.
2. Memungkinkan instructor membuat dan mengelola course.
3. Memungkinkan instructor mengelola materi dan quiz.
4. Memungkinkan student melakukan enrollment course.
5. Mencatat progress pembelajaran setiap student.
6. Melakukan penilaian quiz secara otomatis.
7. Menyediakan dashboard untuk student.
8. Menyediakan dashboard analytics untuk instructor.
9. Mengimplementasikan authentication dan Role-Based Access Control (RBAC).


---

# 3. User Roles

## 3.1 Student

Student dapat:

- Register dan login.
- Melihat daftar course.
- Search dan filter course.
- Melihat detail course.
- Melakukan enrollment.
- Melihat course yang sedang diikuti.
- Mengakses materi course.
- Menandai lesson sebagai selesai.
- Melihat progress pembelajaran.
- Mengerjakan quiz.
- Melihat hasil quiz.
- Melihat course yang telah selesai.


## 3.2 Instructor

Instructor dapat:

- Register dan login sebagai instructor.
- Membuat course.
- Mengedit course.
- Menghapus course.
- Publish/unpublish course.
- Membuat module.
- Membuat lesson.
- Mengatur urutan module dan lesson.
- Membuat quiz.
- Membuat pertanyaan quiz.
- Melihat daftar student yang melakukan enrollment.
- Melihat progress student.
- Melihat statistik course.


---

# 4. Core Features

## 4.1 Authentication

Fitur:

- Register
- Login
- Logout
- JWT authentication
- Password hashing menggunakan bcrypt
- Protected routes
- Role-based authorization
- Get current user/profile

Role:

- student
- instructor


## 4.2 Course Management

Instructor dapat membuat course dengan data:

- Title
- Slug
- Description
- Short description
- Thumbnail
- Category
- Level
- Instructor
- Status
- Created date
- Updated date

Level:

- Beginner
- Intermediate
- Advanced

Status:

- Draft
- Published

Instructor hanya dapat mengubah course miliknya sendiri.


## 4.3 Course Catalog

Student dapat melihat seluruh course dengan status `published`.

Fitur:

- Course list
- Search course
- Filter category
- Filter level
- Course detail
- Instructor information
- Jumlah lesson
- Jumlah student
- Course progress jika sudah enrollment


## 4.4 Module Management

Course terdiri dari beberapa module.

Contoh:

Course: React Fundamentals

Module 1 — Introduction
- What is React?
- Setup Environment

Module 2 — React Basics
- Components
- Props
- State

Instructor dapat:

- Create module
- Update module
- Delete module
- Mengatur urutan module


## 4.5 Lesson Management

Setiap module memiliki beberapa lesson.

Lesson dapat berupa:

- Video
- Text/Article
- PDF/Resource

Data lesson:

- Title
- Description
- Content
- Video URL
- Resource URL
- Lesson type
- Order
- Duration

Instructor dapat:

- Create lesson
- Update lesson
- Delete lesson
- Mengatur urutan lesson


## 4.6 Enrollment

Student dapat melakukan enrollment pada course.

Enrollment menyimpan:

- Student
- Course
- Enrollment date
- Completed lessons
- Progress percentage
- Completion status
- Completed date

Satu student hanya boleh memiliki satu enrollment pada course yang sama.


## 4.7 Learning Page

Student yang sudah enrollment dapat membuka halaman pembelajaran.

Layout:

Sidebar:
- Daftar module
- Daftar lesson
- Status lesson
- Progress course

Main Content:
- Video / article / PDF
- Lesson title
- Lesson description
- Previous lesson
- Next lesson
- Mark as Complete


## 4.8 Learning Progress

Progress dihitung berdasarkan lesson yang telah diselesaikan.

Formula:

progress = completedLessons / totalLessons × 100

Contoh:

Total lesson = 20
Completed = 12

Progress:

12 / 20 × 100 = 60%

Status:

0%        = Not Started
1-99%     = In Progress
100%      = Completed


## 4.9 Quiz Management

Instructor dapat membuat quiz untuk sebuah course/module.

Data quiz:

- Title
- Description
- Passing score
- Time limit (optional)
- Questions


## 4.10 Quiz Question

Versi awal menggunakan Multiple Choice Question.

Question:

- Question text
- Option A
- Option B
- Option C
- Option D
- Correct answer
- Points

Instructor dapat:

- Add question
- Edit question
- Delete question


## 4.11 Quiz Attempt

Student dapat mengerjakan quiz.

Flow:

Start Quiz
↓
Answer Questions
↓
Submit
↓
Server melakukan grading
↓
Calculate Score
↓
Pass / Fail
↓
Save Quiz Attempt

Scoring dilakukan di backend agar correct answer tidak perlu dikirim ke frontend sebelum quiz selesai.


## 4.12 Quiz Result

Student dapat melihat:

- Quiz title
- Score
- Correct answers
- Incorrect answers
- Total questions
- Passing score
- Pass/Fail
- Attempt date


---

# 5. Student Dashboard

Route:

/dashboard

Dashboard student menampilkan:

## KPI Cards

- Enrolled Courses
- Courses Completed
- Lessons Completed
- Average Quiz Score

## Continue Learning

Menampilkan course yang belum selesai.

Informasi:

- Thumbnail
- Course title
- Instructor
- Progress bar
- Progress percentage
- Continue Learning button

## Recent Quiz Results

Menampilkan:

- Quiz
- Course
- Score
- Status
- Date


---

# 6. Instructor Dashboard

Route:

/instructor/dashboard

## KPI Cards

- Total Courses
- Published Courses
- Total Students
- Average Completion Rate

## Course Performance

Chart:

- Enrollment per course
- Completion rate

## Course Table

Kolom:

Course
Status
Students
Lessons
Completion Rate
Actions

Actions:

- Edit
- Manage Content
- Students
- Analytics
- Delete


---

# 7. Instructor Course Builder

Course builder digunakan untuk mengelola struktur course.

Contoh:

React Fundamentals

├── Module 1: Introduction
│   ├── Lesson 1: What is React?
│   ├── Lesson 2: Environment Setup
│   └── Quiz 1
│
├── Module 2: Components
│   ├── Lesson 3: Components
│   ├── Lesson 4: Props
│   └── Quiz 2
│
└── Module 3: State
    ├── Lesson 5: useState
    └── Lesson 6: State Management


---

# 8. Database Design

## User

{
  _id,
  name,
  email,
  password,
  avatar,
  role: "student" | "instructor",
  createdAt,
  updatedAt
}


## Course

{
  _id,
  title,
  slug,
  shortDescription,
  description,
  thumbnail,
  category,
  level,
  instructor,
  status: "draft" | "published",
  createdAt,
  updatedAt
}


## Module

{
  _id,
  course,
  title,
  description,
  order,
  createdAt,
  updatedAt
}


## Lesson

{
  _id,
  module,
  title,
  description,
  type: "video" | "text" | "pdf",
  content,
  videoUrl,
  resourceUrl,
  duration,
  order,
  createdAt,
  updatedAt
}


## Enrollment

{
  _id,
  student,
  course,
  completedLessons: [],
  progress,
  status: "not_started" | "in_progress" | "completed",
  enrolledAt,
  completedAt
}


## Quiz

{
  _id,
  course,
  module,
  title,
  description,
  passingScore,
  timeLimit,
  questions: [
    {
      question,
      options: [],
      correctAnswer,
      points
    }
  ],
  createdAt,
  updatedAt
}


## QuizAttempt

{
  _id,
  quiz,
  student,
  answers: [],
  score,
  correctAnswers,
  incorrectAnswers,
  passed,
  startedAt,
  submittedAt
}


---

# 9. Entity Relationship

User (Instructor)
      |
      | creates
      ↓
Course
      |
      | contains
      ↓
Module
      |
      | contains
      ↓
Lesson

User (Student)
      |
      ↓
Enrollment
      |
      ↓
Course

Course
      |
      ↓
Quiz
      |
      ↓
QuizAttempt
      |
      ↓
Student


---

# 10. REST API Design

Base URL:

/api


## Authentication

POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me


## Courses

GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id

PATCH  /api/courses/:id/publish


## Modules

GET    /api/courses/:courseId/modules
POST   /api/courses/:courseId/modules

PUT    /api/modules/:id
DELETE /api/modules/:id


## Lessons

GET    /api/modules/:moduleId/lessons
POST   /api/modules/:moduleId/lessons

GET    /api/lessons/:id
PUT    /api/lessons/:id
DELETE /api/lessons/:id


## Enrollment

POST   /api/courses/:courseId/enroll

GET    /api/enrollments/my-courses
GET    /api/enrollments/:courseId

PATCH  /api/enrollments/:courseId/lessons/:lessonId/complete


## Quiz

POST   /api/courses/:courseId/quizzes

GET    /api/quizzes/:id
PUT    /api/quizzes/:id
DELETE /api/quizzes/:id


## Quiz Attempt

POST   /api/quizzes/:id/start
POST   /api/quizzes/:id/submit

GET    /api/quiz-attempts/:id
GET    /api/quizzes/:id/attempts


## Instructor Analytics

GET /api/instructor/dashboard
GET /api/instructor/courses/:id/students
GET /api/instructor/courses/:id/analytics


---

# 11. Frontend Pages

## Public

/
 /courses
 /courses/:slug

/auth/login
/auth/register


## Student

/dashboard

/my-learning
/learn/:courseId
/learn/:courseId/lesson/:lessonId

/quiz/:quizId
/quiz/:quizId/result/:attemptId

/profile


## Instructor

/instructor/dashboard

/instructor/courses
/instructor/courses/create

/instructor/courses/:id/edit
/instructor/courses/:id/content
/instructor/courses/:id/students
/instructor/courses/:id/analytics

/instructor/quizzes/:id/edit


---

# 12. UI Layout

## Main Navbar

Logo

Navigation:
- Home
- Courses
- My Learning

Right:
- Search
- Notification
- Profile


## Instructor Sidebar

Dashboard
Courses
Students
Analytics

Profile
Logout


## Student Sidebar

Dashboard
My Learning
Quiz Results
Profile


---

# 13. Tech Stack

## Frontend

React.js
Vite
JavaScript / TypeScript
Tailwind CSS
React Router
Axios
Zustand atau Redux Toolkit
React Hook Form
Recharts
Lucide React


## Backend

Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Multer
Express Validator / Zod


## Database

MongoDB Atlas


## Deployment

Frontend:
Vercel

Backend:
Render / Railway

Database:
MongoDB Atlas

Media:
Cloudinary


---

# 14. Suggested Project Structure

learnify/
│
├── client/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── course/
│   │   │   ├── dashboard/
│   │   │   ├── learning/
│   │   │   └── quiz/
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── StudentLayout.jsx
│   │   │   └── InstructorLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   ├── student/
│   │   │   └── instructor/
│   │   │
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── moduleController.js
│   │   │   ├── lessonController.js
│   │   │   ├── enrollmentController.js
│   │   │   └── quizController.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   ├── Module.js
│   │   │   ├── Lesson.js
│   │   │   ├── Enrollment.js
│   │   │   ├── Quiz.js
│   │   │   └── QuizAttempt.js
│   │   │
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json


---

# 15. Environment Variables

Server:

PORT=5000

MONGODB_URI=mongodb+srv://...

JWT_SECRET=your_secret

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=


Frontend:

VITE_API_URL=http://localhost:5000/api


---

# 16. Business Rules

1. Course hanya dapat dibuat oleh instructor.

2. Instructor hanya dapat mengedit course miliknya sendiri.

3. Course dengan status draft tidak ditampilkan pada public course catalog.

4. Student harus login sebelum melakukan enrollment.

5. Student hanya dapat enroll satu kali pada course yang sama.

6. Student harus enrollment sebelum dapat mengakses seluruh materi course.

7. Lesson completion harus disimpan berdasarkan student dan course.

8. Progress dihitung berdasarkan jumlah lesson yang selesai.

9. Course dianggap completed ketika seluruh lesson wajib selesai.

10. Quiz hanya dapat dikerjakan oleh student yang sudah enrollment.

11. Quiz grading dilakukan oleh backend.

12. Correct answer tidak dikirim ke frontend sebelum student melakukan submit.

13. Quiz attempt harus menyimpan score dan status pass/fail.

14. Instructor hanya dapat melihat analytics course miliknya.


---

# 17. Main Application Flow

Instructor:

Register/Login
↓
Instructor Dashboard
↓
Create Course
↓
Create Modules
↓
Create Lessons
↓
Create Quiz
↓
Publish Course
↓
Monitor Students
↓
View Analytics


Student:

Register/Login
↓
Browse Courses
↓
Course Detail
↓
Enroll
↓
My Learning
↓
Open Course
↓
Study Lessons
↓
Complete Lessons
↓
Take Quiz
↓
Quiz Result
↓
Progress Updated
↓
Complete Course


---

# 18. MVP Scope

Fitur yang WAJIB untuk versi pertama:

- Authentication
- Student & Instructor role
- Course CRUD
- Module CRUD
- Lesson CRUD
- Course catalog
- Course detail
- Enrollment
- Learning page
- Lesson completion
- Progress tracking
- Multiple-choice quiz
- Automatic quiz grading
- Quiz result
- Student dashboard
- Instructor dashboard
- Basic analytics


---

# 19. Out of Scope MVP

Belum perlu dibuat pada versi pertama:

- Payment gateway
- Subscription
- Live streaming
- Video conference
- Chat
- Forum
- Assignment submission
- AI tutor
- Certificate
- Email notification
- Mobile application
- Multi instructor course

Fitur tersebut dapat dikembangkan setelah core LMS selesai.


---

# 20. Development Priority

Phase 1 — Foundation

Authentication
↓
Role Authorization
↓
MongoDB Models
↓
Frontend Layout


Phase 2 — Course Management

Course CRUD
↓
Module CRUD
↓
Lesson CRUD
↓
Course Publishing


Phase 3 — Student Learning

Course Catalog
↓
Course Detail
↓
Enrollment
↓
Learning Page
↓
Lesson Completion
↓
Progress Tracking


Phase 4 — Quiz

Quiz CRUD
↓
Question Management
↓
Quiz Attempt
↓
Automatic Grading
↓
Quiz Result


Phase 5 — Dashboard

Student Dashboard
↓
Instructor Dashboard
↓
Course Analytics


Phase 6 — Finalization

Validation
↓
Error Handling
↓
Responsive UI
↓
Testing
↓
Deployment


---

# 21. MVP Success Criteria

Project dianggap selesai apabila:

1. Student dan instructor dapat register/login.
2. Role memiliki authorization yang berbeda.
3. Instructor dapat membuat dan publish course.
4. Instructor dapat membuat module dan lesson.
5. Student dapat menemukan published course.
6. Student dapat melakukan enrollment.
7. Student dapat mengikuti lesson.
8. Sistem dapat menyimpan lesson completion.
9. Sistem dapat menghitung progress secara otomatis.
10. Instructor dapat membuat quiz.
11. Student dapat mengerjakan quiz.
12. Backend dapat menghitung nilai quiz.
13. Student dapat melihat hasil quiz.
14. Student dashboard menampilkan progress belajar.
15. Instructor dashboard menampilkan course dan statistik student.
16. Frontend dan backend berhasil terhubung melalui REST API.
17. Database production menggunakan MongoDB Atlas.
18. Aplikasi dapat di-deploy dan digunakan secara online.