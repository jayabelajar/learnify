# Learnify

Learnify adalah Learning Management System berbasis MERN stack untuk student dan instructor.

## Menjalankan Project

```bash
npm install
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Frontend berjalan di `http://localhost:5173`, backend di `http://localhost:5000/api`.

## Role Demo

- Student dapat melihat katalog course, enroll, lanjut belajar, menyelesaikan lesson, dan mengerjakan quiz.
- Instructor dapat membuat course, module, lesson, quiz, publish course, serta melihat analytics dan daftar student.

Backend menggunakan MongoDB melalui `MONGODB_URI`.
