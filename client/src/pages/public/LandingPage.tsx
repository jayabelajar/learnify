import { ArrowRight, BookOpenCheck, CheckCircle2, GraduationCap, Menu, Play, Star, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Course } from '../../types';

type LandingPageProps = {
  courses: Course[];
  onLogin: (role: 'student' | 'instructor' | 'admin') => void;
};

const categories = ['All', 'Web Dev', 'Data Science', 'UI/UX Design', 'Backend'];

export function LandingPage({ courses, onLogin }: LandingPageProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const featuredCourses = useMemo(() => {
    const published = courses.filter((course) => course.status === 'published').slice(0, 6);
    if (category === 'All') return published;
    return published.filter((course) => course.category === category);
  }, [category, courses]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          <a className="flex items-center gap-3" href="#">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-200">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold tracking-tight">Learnify</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="hover:text-brand-600" href="#features">Features</a>
            <a className="hover:text-brand-600" href="#courses">Courses</a>
            <a className="hover:text-brand-600" href="#roles">For Instructors</a>
            <a className="hover:text-brand-600" href="#pricing">Pricing</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600" onClick={() => onLogin('student')}>Log In</button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700" onClick={() => onLogin('student')}>
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="space-y-3 border-t border-slate-100 bg-white px-4 py-5 md:hidden">
            {['features', 'courses', 'roles', 'pricing'].map((item) => (
              <a key={item} className="block py-2 text-sm font-semibold capitalize text-slate-700" href={`#${item}`} onClick={() => setMobileOpen(false)}>
                {item}
              </a>
            ))}
            <button className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white" onClick={() => onLogin('student')}>Get Started</button>
          </div>
        )}
      </header>

      <main>
        <section className="overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              <div className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
                #1 E-Learning Platform for Tech & Design
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Master Modern Skills with <span className="text-brand-600">Industry Experts</span>
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                Learnify menyatukan course catalog, lesson player, assignments, quizzes, certificates, diskusi, dan dashboard analytics dalam satu platform kursus online fullstack.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-brand-700" onClick={() => onLogin('student')}>
                  Start Learning <ArrowRight className="h-4 w-4" />
                </button>
                <button className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100" onClick={() => onLogin('instructor')}>
                  Teach on Learnify
                </button>
              </div>
              <div className="flex flex-col items-center gap-4 border-t border-slate-200/80 pt-6 text-xs text-slate-500 sm:flex-row lg:justify-start">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-slate-900">4.9 / 5.0</span>
                </div>
                <p className="font-medium">Trusted by 10,000+ ambitious learners</p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Learnify Player Preview</span>
                </div>
                <div className="group relative mt-3 flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-inner">
                  <img className="h-full w-full object-cover opacity-60 transition-transform duration-300 group-hover:scale-105" src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&auto=format&fit=crop&q=80" alt="Lesson preview" />
                  <span className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
                    <Play className="ml-1 h-6 w-6" />
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-slate-900/80 p-2 text-xs text-slate-200">
                    <span className="font-medium">Lesson 04: Component State</span>
                    <span className="font-bold text-brand-300">14:20</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Modern React Development</p>
                      <p className="text-[11px] text-slate-500">75% Lessons Completed</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">In Progress</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              ['40,000+', 'Active Learners'],
              ['250+', 'Expert Instructors'],
              ['94%', 'Course Completion'],
              ['4.8 / 5', 'Average Rating']
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-brand-600 sm:text-4xl">{value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="courses" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Explore Catalog</span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Popular Courses Built for Real Careers</h2>
              <p className="text-sm text-slate-600 sm:text-base">Katalog course terhubung dengan data course backend dan fallback demo.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((item) => (
                <button key={item} className={`rounded-xl px-4 py-2 text-sm transition ${category === item ? 'bg-brand-600 font-semibold text-white shadow-sm' : 'border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-100'}`} onClick={() => setCategory(item)}>
                  {item}
                </button>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <article key={course.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <img className="h-48 w-full object-cover" src={course.thumbnail} alt={course.title} />
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{course.category}</span>
                      <span className="text-xs font-semibold text-amber-600">{course.rating} stars</span>
                    </div>
                    <h3 className="text-base font-bold leading-snug">{course.title}</h3>
                    <p className="line-clamp-2 text-sm text-slate-500">{course.shortDescription || course.description}</p>
                    <button className="w-full rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-600 hover:text-white" onClick={() => onLogin('student')}>
                      Enroll in App
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-slate-200 bg-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {[
              [BookOpenCheck, 'Structured Learning', 'Module, lesson, quiz, assignment, progress, dan certificate dalam satu alur belajar.'],
              [Users, 'Instructor Studio', 'Course builder, quiz bank, submissions, students, announcements, dan analytics.'],
              [GraduationCap, 'Admin Control', 'Users, categories, enrollments, reports, roles, reviews, audit logs, dan settings.']
            ].map(([Icon, title, text]: any) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <Icon className="h-7 w-7 text-brand-600" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="roles" className="py-16 text-center sm:py-20">
          <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to Learn, Teach, or Manage Courses?</h2>
            <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base">Masuk sebagai student, instructor, atau admin untuk mencoba workflow fullstack Learnify.</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700" onClick={() => onLogin('student')}>Student Portal</button>
              <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100" onClick={() => onLogin('instructor')}>Instructor Studio</button>
              <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100" onClick={() => onLogin('admin')}>Admin Console</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
