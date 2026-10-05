# Product Requirements Document
# Learnify - Fullstack Online Course Platform

## 1. Overview

Learnify adalah platform kursus online fullstack berbasis MERN Stack dan TypeScript. Sistem ini mendukung proses end-to-end pembelajaran digital: public landing page, katalog course, enrollment, lesson player, assignment, quiz, certificate, discussion, announcement, analytics, dan admin control.

Platform memiliki tiga role utama:

- Student: mencari course, enroll, belajar, submit assignment, mengerjakan quiz, berdiskusi, dan menerima certificate.
- Instructor: membuat course, mengelola content, assignment, quiz, submission, student, discussion, announcement, dan analytics.
- Admin: mengelola user, course, category, enrollment, report, role policy, announcement, review, audit log, dan platform settings.

## 2. Objectives

1. Menyediakan platform kursus online berbasis web yang lengkap dan responsif.
2. Menghubungkan frontend React dengan backend Express melalui REST API.
3. Mengimplementasikan authentication, authorization, dan role-based access control.
4. Menyediakan workflow nyata untuk student, instructor, dan admin.
5. Menyimpan data utama di MongoDB Atlas menggunakan Mongoose.
6. Menyediakan fallback demo data agar UI tetap dapat dipresentasikan ketika API/database belum aktif.

## 3. Roles And Menus

### Student

- Dashboard
- Browse Courses
- My Courses
- Assignments
- Quizzes
- Certificates
- Calendar
- Discussions
- Wishlist
- Profile

### Instructor

- Dashboard
- My Courses
- Course Builder
- Assignments
- Quiz Bank
- Submissions
- Students
- Discussions
- Announcements
- Analytics
- Profile

### Admin

- Dashboard
- Users
- Courses
- Categories
- Enrollments
- Reports
- Roles & Permissions
- Announcements
- Reviews
- Audit Logs
- Settings
- Profile

## 4. Core Features

### Public Landing Page

- Brand hero based on `docs/ui-landing.html`.
- Featured course catalog.
- Platform stats.
- Student, instructor, and admin entry points.
- Responsive navigation.

### Authentication

- Login and register.
- JWT authentication.
- Password hashing with bcrypt.
- Role-based API protection.
- Current user profile.

### Course Management

- Instructor/admin can create, update, delete, publish, and unpublish courses.
- Course fields: title, slug, description, short description, thumbnail, category, level, instructor, status.
- Course detail contains modules and lessons.

### Module And Lesson Management

- Instructor/admin can manage modules and lessons.
- Lesson supports article, video, quiz, and submission types.
- Student can complete lessons and track progress.

### Enrollment

- Student can enroll in published courses.
- System tracks completed lessons, progress percentage, status, enrollment date, and completion date.
- Admin can view all enrollments.

### Assignment And Submission

- Instructor/admin can create assignments for courses.
- Student can view assignments for enrolled courses and submit work.
- Instructor/admin can review submissions, assign grade, and provide feedback.

### Quiz And Assessment

- Instructor/admin can create quiz data for courses.
- Student can start and submit quiz attempts.
- Backend performs grading so correct answers are not exposed before submission.
- Student can view quiz results.
- Instructor can monitor quiz attempts.

### Certificates

- Certificates are issued for completed courses.
- Student can view certificate list.
- Instructor/admin can issue certificates.

### Discussions

- Student and instructor can create discussion threads.
- Threads can be linked to courses.
- Role-specific filtering keeps discussions relevant.

### Announcements

- Instructor/admin can publish announcements.
- Audience can be all, student, or instructor.
- Student/instructor dashboards consume role-relevant announcements.

### Admin Platform Control

- User management.
- Course moderation.
- Category management.
- Enrollment monitoring.
- Reports and analytics.
- Role & permission documentation.
- Review moderation.
- Audit log monitoring.
- System settings.

## 5. Main Entities

- User
- Course
- Category
- Module
- Lesson
- Enrollment
- Assignment
- Submission
- Quiz
- QuizAttempt
- Certificate
- DiscussionThread
- Announcement
- Review
- AuditLog

## 6. REST API

Base URL:

```txt
/api
```

### Authentication

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Courses

```txt
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
PATCH  /api/courses/:id/publish
POST   /api/courses/:courseId/enroll
POST   /api/courses/:courseId/quizzes
```

### Modules And Lessons

```txt
GET    /api/courses/:courseId/modules
POST   /api/courses/:courseId/modules
PUT    /api/modules/:id
DELETE /api/modules/:id
POST   /api/modules/:moduleId/lessons
PUT    /api/lessons/:id
DELETE /api/lessons/:id
```

### Enrollments

```txt
GET   /api/enrollments
GET   /api/enrollments/my-courses
GET   /api/enrollments/:courseId
PATCH /api/enrollments/:courseId/lessons/:lessonId/complete
```

### Quizzes

```txt
GET    /api/quizzes/:id
PUT    /api/quizzes/:id
DELETE /api/quizzes/:id
POST   /api/quizzes/:id/start
POST   /api/quizzes/:id/submit
GET    /api/quizzes/:id/attempts
GET    /api/quizzes/attempts/:id
```

### Platform Resources

```txt
GET  /api/platform/categories
POST /api/platform/categories

GET  /api/platform/assignments
POST /api/platform/assignments

GET   /api/platform/submissions
POST  /api/platform/submissions
PATCH /api/platform/submissions/:id/review

GET  /api/platform/certificates
POST /api/platform/certificates

GET  /api/platform/discussions
POST /api/platform/discussions

GET  /api/platform/announcements
POST /api/platform/announcements

GET  /api/platform/reviews
POST /api/platform/reviews

GET  /api/platform/audit-logs
```

## 7. Frontend Pages

### Public

- `/`
- `/login/student`
- `/login/instructor`
- `/login/admin`

### Student

- `/dashboard`
- `/explore-courses`
- `/my-learning`
- `/assignments`
- `/quiz-results`
- `/certificates`
- `/calendar`
- `/discussions`
- `/wishlist`
- `/profile`

### Instructor

- `/dashboard`
- `/courses`
- `/course-builder`
- `/assignments`
- `/quiz-bank`
- `/submissions`
- `/students`
- `/discussions`
- `/announcements`
- `/analytics`
- `/profile`

### Admin

- `/dashboard`
- `/users`
- `/courses`
- `/categories`
- `/enrollments`
- `/reports`
- `/roles`
- `/announcements`
- `/reviews`
- `/audit-logs`
- `/settings`
- `/profile`

## 8. Business Rules

1. Student can only enroll in published courses.
2. Student can only access assignments and discussions for enrolled courses.
3. Instructor can only manage courses and resources for courses they own.
4. Admin can access platform-wide resources.
5. Quiz grading must happen on the backend.
6. Correct quiz answers must not be sent to student before submission.
7. Enrollment progress is calculated from completed lessons.
8. Certificate can be issued after course completion.
9. Every important admin/instructor operation may create an audit log.

## 9. Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Helmet
- CORS

## 10. MVP Completion Criteria

1. Landing page is available at `/`.
2. Student, instructor, and admin can log in.
3. Role-specific sidebars show complete online-course workflows.
4. Course, module, lesson, enrollment, quiz, and user APIs work.
5. Platform resource APIs exist for assignments, submissions, certificates, discussions, announcements, reviews, categories, and audit logs.
6. Frontend consumes backend APIs and falls back to demo data when unavailable.
7. Build succeeds for frontend and backend.
8. Code is committed and pushed to GitHub.
