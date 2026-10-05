import { CourseModal } from '../components/course/CourseModal';
import { AdminCourses } from '../pages/admin/AdminCourses';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminSettings } from '../pages/admin/AdminSettings';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { LoginPage } from '../pages/auth/LoginPage';
import { AnalyticsPage } from '../pages/instructor/AnalyticsPage';
import { ContentBuilder } from '../pages/instructor/ContentBuilder';
import { CourseManagement } from '../pages/instructor/CourseManagement';
import { InstructorDashboard } from '../pages/instructor/InstructorDashboard';
import { StudentsTable } from '../pages/instructor/StudentsTable';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { LandingPage } from '../pages/public/LandingPage';
import { PlatformResourcePage } from '../pages/platform/PlatformResourcePage';
import { ExploreCourses } from '../pages/student/ExploreCourses';
import { AssignmentDetail } from '../pages/student/AssignmentDetail';
import { CertificateDetail } from '../pages/student/CertificateDetail';
import { CourseDetail } from '../pages/student/CourseDetail';
import { LessonPlayer } from '../pages/student/LessonPlayer';
import { MyLearning } from '../pages/student/MyLearning';
import { QuizDetail } from '../pages/student/QuizDetail';
import { QuizResults } from '../pages/student/QuizResults';
import { QuizView } from '../pages/student/QuizView';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import type { useLearnifyApp } from '../hooks/useLearnifyApp';

type AppModel = ReturnType<typeof useLearnifyApp>;

export function AppContent({ model }: { model: AppModel }) {
  const { state, actions } = model;
  const p = state.platform;
  const selectedAssignment = p.assignments.find((item) => item.id === state.selectedAssignmentId) || p.assignments[0];
  const selectedCertificate = p.certificates.find((item) => item.id === state.selectedCertificateId) || p.certificates[0];
  const selectedQuiz = p.quizzes.find((item) => item.id === state.selectedQuizId) || p.quizzes[0];

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className={state.activeTab === 'landing' ? '' : 'mx-auto max-w-7xl space-y-6 p-4 md:p-6'}>
          {state.activeTab === 'landing' && <LandingPage courses={state.courses} onLogin={actions.goToLogin} />}
          {state.activeTab.startsWith('login-') && <LoginPage role={state.role} onLogin={actions.login} onRegister={actions.register} onSwitch={actions.goToLogin} />}

          {state.role === 'student' && state.activeTab === 'dashboard' && (
            <StudentDashboard kpis={state.studentKpis} courses={state.enrolledCourses} quizResults={state.quizResults} onExplore={() => actions.navigate('explore-courses')} onOpenLesson={actions.openLesson} />
          )}
          {state.role === 'student' && state.activeTab === 'explore-courses' && (
            <ExploreCourses courses={state.filteredExploreCourses} search={state.courseSearch} category={state.category} level={state.level} onSearch={actions.setCourseSearch} onCategory={actions.setCategory} onLevel={actions.setLevel} onEnroll={actions.toggleEnrollment} onOpenLesson={actions.openCourseDetail} />
          )}
          {state.role === 'student' && state.activeTab === 'course-detail' && (
            <CourseDetail course={state.selectedCourse} onEnroll={actions.toggleEnrollment} onStart={actions.openLesson} onBack={() => actions.navigate('explore-courses')} />
          )}
          {state.role === 'student' && state.activeTab === 'my-learning' && (
            <MyLearning courses={state.filteredLearning} search={state.courseSearch} category={state.category} level={state.level} completion={state.completion} onSearch={actions.setCourseSearch} onCategory={actions.setCategory} onLevel={actions.setLevel} onCompletion={actions.setCompletion} onOpenLesson={actions.openLesson} onStartQuiz={actions.startQuiz} />
          )}
          {state.role === 'student' && state.activeTab === 'lesson-player' && (
            <LessonPlayer course={state.selectedCourse} activeLesson={state.activeLesson} onSelectLesson={actions.setActiveLesson} onComplete={actions.markLessonComplete} onBack={() => actions.navigate('my-learning')} />
          )}
          {state.role === 'student' && state.activeTab === 'quiz-view' && state.activeQuiz && (
            <QuizView quiz={state.activeQuiz} answers={state.answers} index={state.questionIndex} onAnswer={(questionId, answer) => actions.setAnswers((items) => ({ ...items, [questionId]: answer }))} onIndex={actions.setQuestionIndex} onSubmit={actions.submitQuiz} />
          )}
          {state.role === 'student' && state.activeTab === 'quiz-results' && (
            <div className="space-y-6">
              <QuizResults results={state.quizResults} />
              <PlatformResourcePage title="Available Quizzes" description="Lihat detail quiz dan riwayat attempt sebelum mengerjakan assessment berikutnya." primaryAction="Refresh" headers={['Quiz', 'Course', 'Questions', 'Passing Score', 'Status']} rows={p.quizzes.map((item) => [item.title, item.courseTitle, item.questions, item.passingScore, item.status])} rowActions={[{ label: 'View Detail', onClick: (index) => actions.openQuizDetail(p.quizzes[index].id) }]} />
            </div>
          )}
          {state.role === 'student' && state.activeTab === 'quiz-detail' && selectedQuiz && (
            <QuizDetail quiz={selectedQuiz} results={state.quizResults.filter((item) => item.quizTitle === selectedQuiz.title || item.courseTitle === selectedQuiz.courseTitle)} onBack={() => actions.navigate('quiz-results')} />
          )}
          {state.role === 'student' && state.activeTab === 'assignments' && (
            <PlatformResourcePage title="Assignments" description="Submit tugas course, pantau deadline, dan lihat status penilaian dari instructor." primaryAction="Submit Assignment" headers={['Assignment', 'Course', 'Due Date', 'Status', 'Points']} rows={p.assignments.map((item) => [item.title, item.courseTitle, item.dueDate, item.status, item.points])} stats={[['Assignments', p.assignments.length], ['Published', p.assignments.filter((item) => item.status === 'published').length], ['Open', p.assignments.filter((item) => item.status !== 'closed').length]]} rowActions={[{ label: 'View Detail', onClick: (index) => actions.openAssignmentDetail(p.assignments[index].id) }]} />
          )}
          {state.role === 'student' && state.activeTab === 'assignment-detail' && selectedAssignment && (
            <AssignmentDetail assignment={selectedAssignment} submissions={p.submissions.filter((item) => item.assignmentTitle === selectedAssignment.title)} onSubmit={actions.submitAssignment} onBack={() => actions.navigate('assignments')} />
          )}
          {state.role === 'student' && state.activeTab === 'certificates' && (
            <PlatformResourcePage title="Certificates" description="Kumpulan sertifikat course yang sudah selesai dan siap diverifikasi." primaryAction="Verify Certificate" headers={['Certificate ID', 'Student', 'Course', 'Issued At', 'Status']} rows={p.certificates.map((item) => [item.certificateId, item.studentName, item.courseTitle, item.issuedAt, item.status])} rowActions={[{ label: 'Verify', onClick: (index) => actions.openCertificateDetail(p.certificates[index].id) }]} />
          )}
          {state.role === 'student' && state.activeTab === 'certificate-detail' && selectedCertificate && (
            <CertificateDetail certificate={selectedCertificate} onBack={() => actions.navigate('certificates')} />
          )}
          {state.role === 'student' && state.activeTab === 'calendar' && (
            <PlatformResourcePage title="Calendar" description="Jadwal assignment, quiz, dan live session agar progres belajar tetap rapi." primaryAction="Add Reminder" headers={['Title', 'Date', 'Type', 'Status']} rows={p.calendar.map((item) => [item.title, item.date, item.type, item.status])} />
          )}
          {state.role === 'student' && state.activeTab === 'discussions' && (
            <PlatformResourcePage title="Discussions" description="Forum diskusi course untuk tanya jawab dengan instructor dan sesama student." primaryAction="New Thread" headers={['Topic', 'Course', 'Author', 'Replies', 'Status']} rows={p.discussions.map((item) => [item.title, item.courseTitle, item.authorName, item.replies, item.status])} />
          )}
          {state.role === 'student' && state.activeTab === 'wishlist' && (
            <PlatformResourcePage title="Wishlist" description="Course yang disimpan untuk dipelajari berikutnya." primaryAction="Browse More" headers={['Course', 'Category', 'Level', 'Price']} rows={p.wishlist.map((item) => [item.title, item.category, item.level, item.price])} />
          )}

          {state.role === 'instructor' && state.activeTab === 'dashboard' && <InstructorDashboard courses={state.courses} />}
          {state.role === 'instructor' && state.activeTab === 'courses' && (
            <CourseManagement
              courses={state.courses.filter((course) => course.title.toLowerCase().includes(state.courseSearch.toLowerCase()))}
              search={state.courseSearch}
              onSearch={actions.setCourseSearch}
              onCreate={actions.openCreateCourseModal}
              onEdit={actions.openEditCourseModal}
              onDelete={actions.deleteCourse}
              onTogglePublish={actions.togglePublish}
              onManage={actions.manageCourseContent}
            />
          )}
          {state.role === 'instructor' && state.activeTab === 'course-builder' && (
            <ContentBuilder courses={state.courses} selectedCourse={state.selectedBuilderCourse} onSelectCourse={actions.setSelectedCourseId} onAddModule={actions.addModule} onAddLesson={actions.addLesson} onUpdateLesson={actions.updateLesson} onDeleteLesson={actions.deleteLesson} />
          )}
          {state.role === 'instructor' && state.activeTab === 'students' && <StudentsTable />}
          {state.role === 'instructor' && state.activeTab === 'assignments' && (
            <PlatformResourcePage title="Assignments" description="Buat dan publish assignment untuk course yang kamu kelola." headers={['Assignment', 'Course', 'Due Date', 'Status', 'Points']} rows={p.assignments.map((item) => [item.title, item.courseTitle, item.dueDate, item.status, item.points])} formFields={[{ name: 'title', label: 'Title' }, { name: 'dueDate', label: 'Due Date', type: 'date' }, { name: 'points', label: 'Points', type: 'number' }, { name: 'instructions', label: 'Instructions', type: 'textarea' }]} onCreate={actions.createAssignment} />
          )}
          {state.role === 'instructor' && state.activeTab === 'quiz-bank' && (
            <PlatformResourcePage title="Quiz Bank" description="Kelola bank quiz dan passing score untuk assessment tiap course." primaryAction="Create Quiz" headers={['Quiz', 'Course', 'Questions', 'Passing Score', 'Status']} rows={p.quizzes.map((item) => [item.title, item.courseTitle, item.questions, item.passingScore, item.status])} formFields={[{ name: 'title', label: 'Quiz Title' }, { name: 'passingScore', label: 'Passing Score', type: 'number' }, { name: 'question', label: 'Question' }, { name: 'optionA', label: 'Option A' }, { name: 'optionB', label: 'Option B' }, { name: 'optionC', label: 'Option C' }, { name: 'optionD', label: 'Option D' }]} onCreate={actions.createQuiz} />
          )}
          {state.role === 'instructor' && state.activeTab === 'submissions' && (
            <PlatformResourcePage title="Submissions" description="Review submission student, beri grade, dan feedback." primaryAction="Review Queue" headers={['Student', 'Assignment', 'Course', 'Status', 'Grade']} rows={p.submissions.map((item) => [item.studentName, item.assignmentTitle, item.courseTitle, item.status, item.grade])} rowActions={[{ label: 'Mark Reviewed', onClick: (index) => actions.reviewSubmission(p.submissions[index].id, 100) }]} />
          )}
          {state.role === 'instructor' && state.activeTab === 'discussions' && (
            <PlatformResourcePage title="Discussions" description="Pantau pertanyaan student dan diskusi course yang kamu ajar." primaryAction="Answer Thread" headers={['Topic', 'Course', 'Author', 'Replies', 'Status']} rows={p.discussions.map((item) => [item.title, item.courseTitle, item.authorName, item.replies, item.status])} />
          )}
          {state.role === 'instructor' && state.activeTab === 'announcements' && (
            <PlatformResourcePage title="Announcements" description="Kirim announcement untuk student course atau semua audience yang relevan." primaryAction="Create Announcement" headers={['Title', 'Audience', 'Status', 'Published At']} rows={p.announcements.map((item) => [item.title, item.audience, item.status, item.publishedAt])} formFields={[{ name: 'title', label: 'Title' }, { name: 'audience', label: 'Audience', placeholder: 'student, instructor, or all' }, { name: 'body', label: 'Body', type: 'textarea' }]} onCreate={actions.createAnnouncement} />
          )}
          {state.role === 'instructor' && state.activeTab === 'analytics' && <AnalyticsPage courses={state.courses} />}

          {state.role === 'admin' && state.activeTab === 'dashboard' && <AdminDashboard users={state.users} courses={state.courses} />}
          {state.role === 'admin' && state.activeTab === 'users' && <AdminUsers users={state.users} onUsers={actions.setUsers} />}
          {state.role === 'admin' && state.activeTab === 'courses' && <AdminCourses courses={state.courses} />}
          {state.role === 'admin' && state.activeTab === 'categories' && (
            <PlatformResourcePage title="Categories" description="Kelola kategori katalog agar course discovery lebih rapi." headers={['Category', 'Description', 'Status']} rows={p.categories.map((item) => [item.name, item.description, item.status])} formFields={[{ name: 'name', label: 'Category Name' }, { name: 'description', label: 'Description', type: 'textarea' }]} onCreate={actions.createCategory} />
          )}
          {state.role === 'admin' && state.activeTab === 'enrollments' && (
            <PlatformResourcePage title="Enrollments" description="Pantau enrollment seluruh student dan progres course di platform." primaryAction="Export Report" headers={['Student', 'Course', 'Progress', 'Status']} rows={p.enrollments.map((item) => [item.studentName, item.courseTitle, item.progress, item.status])} />
          )}
          {state.role === 'admin' && state.activeTab === 'reports' && <AnalyticsPage courses={state.courses} />}
          {state.role === 'admin' && state.activeTab === 'roles' && (
            <PlatformResourcePage title="Roles & Permissions" description="Dokumentasi role access control untuk student, instructor, dan admin." primaryAction="Review Policy" headers={['Role', 'Permissions', 'Users']} rows={p.roles.map((item) => [item.name, item.permissions, item.users])} />
          )}
          {state.role === 'admin' && state.activeTab === 'announcements' && (
            <PlatformResourcePage title="Announcements" description="Kelola pengumuman global untuk student dan instructor." headers={['Title', 'Audience', 'Status', 'Published At']} rows={p.announcements.map((item) => [item.title, item.audience, item.status, item.publishedAt])} formFields={[{ name: 'title', label: 'Title' }, { name: 'audience', label: 'Audience', placeholder: 'student, instructor, or all' }, { name: 'body', label: 'Body', type: 'textarea' }]} onCreate={actions.createAnnouncement} />
          )}
          {state.role === 'admin' && state.activeTab === 'reviews' && (
            <PlatformResourcePage title="Reviews" description="Moderasi ulasan course agar kualitas katalog tetap terjaga." primaryAction="Moderate" headers={['Course', 'Student', 'Rating', 'Status']} rows={p.reviews.map((item) => [item.courseTitle, item.studentName, item.rating, item.status])} rowActions={[{ label: 'Hide', onClick: (index) => actions.moderateReview(p.reviews[index].id), danger: true }]} />
          )}
          {state.role === 'admin' && state.activeTab === 'audit-logs' && (
            <PlatformResourcePage title="Audit Logs" description="Jejak aktivitas penting untuk kebutuhan keamanan dan monitoring admin." primaryAction="Export Logs" headers={['Actor', 'Action', 'Entity', 'Created At']} rows={p.auditLogs.map((item) => [item.actorName, item.action, item.entity, item.createdAt])} rowActions={[{ label: 'Delete', onClick: (index) => actions.deleteAuditLog(p.auditLogs[index].id), danger: true }]} />
          )}
          {state.role === 'admin' && state.activeTab === 'settings' && <AdminSettings />}

          {state.activeTab === 'profile' && <ProfilePage profile={state.profile} onSave={actions.saveProfile} />}
        </div>
      </main>

      {state.showCourseModal && <CourseModal editing={state.editingCourse} form={state.courseForm} onChange={actions.setCourseForm} onClose={actions.closeCourseModal} onSave={actions.saveCourse} />}
    </>
  );
}
