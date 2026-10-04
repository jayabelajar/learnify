# Learnify

Learnify adalah Learning Management System berbasis MERN stack + TypeScript untuk student dan instructor.

## Menjalankan Project

```bash
npm install
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Frontend berjalan di `http://localhost:5173`, backend di `http://localhost:5000/api`.
Gunakan `npm run build` dari root untuk compile backend TypeScript dan build frontend production.

## Role Demo

- Student dapat melihat katalog course, enroll, lanjut belajar, menyelesaikan lesson, dan mengerjakan quiz.
- Instructor dapat membuat course, module, lesson, quiz, publish course, serta melihat analytics dan daftar student.

Backend menggunakan MongoDB melalui `MONGODB_URI`. Untuk smoke test API tanpa koneksi database, set `SKIP_DB=true`.
