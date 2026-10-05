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
import { ExploreCourses } from '../pages/student/ExploreCourses';
import { LessonPlayer } from '../pages/student/LessonPlayer';
import { MyLearning } from '../pages/student/MyLearning';
import { QuizResults } from '../pages/student/QuizResults';
import { QuizView } from '../pages/student/QuizView';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import type { useLearnifyApp } from '../hooks/useLearnifyApp';

type AppModel = ReturnType<typeof useLearnifyApp>;

export function AppContent({ model }: { model: AppModel }) {
  const { state, actions } = model;

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
          {state.activeTab.startsWith('login-') && <LoginPage role={state.role} onLogin={actions.login} onSwitch={actions.goToLogin} />}

          {state.role === 'student' && state.activeTab === 'dashboard' && (
            <StudentDashboard kpis={state.studentKpis} courses={state.enrolledCourses} quizResults={state.quizResults} onExplore={() => actions.navigate('explore-courses')} onOpenLesson={actions.openLesson} />
          )}
          {state.role === 'student' && state.activeTab === 'explore-courses' && (
            <ExploreCourses courses={state.filteredExploreCourses} search={state.courseSearch} category={state.category} level={state.level} onSearch={actions.setCourseSearch} onCategory={actions.setCategory} onLevel={actions.setLevel} onEnroll={actions.toggleEnrollment} onOpenLesson={actions.openLesson} />
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
          {state.role === 'student' && state.activeTab === 'quiz-results' && <QuizResults results={state.quizResults} />}

          {state.role === 'instructor' && state.activeTab === 'dashboard' && <InstructorDashboard courses={state.courses} />}
          {state.role === 'instructor' && state.activeTab === 'courses' && (
            <CourseManagement
              courses={state.courses.filter((course) => course.title.toLowerCase().includes(state.courseSearch.toLowerCase()))}
              search={state.courseSearch}
              onSearch={actions.setCourseSearch}
              onCreate={actions.openCreateCourseModal}
              onEdit={actions.openEditCourseModal}
              onDelete={(courseId) => actions.setCourses((items) => items.filter((course) => course.id !== courseId))}
              onTogglePublish={actions.togglePublish}
              onManage={actions.manageCourseContent}
            />
          )}
          {state.role === 'instructor' && state.activeTab === 'course-builder' && (
            <ContentBuilder courses={state.courses} selectedCourse={state.selectedBuilderCourse} onSelectCourse={actions.setSelectedCourseId} onAddModule={actions.addModule} onAddLesson={actions.addLesson} onUpdateLesson={actions.updateLesson} onDeleteLesson={actions.deleteLesson} />
          )}
          {state.role === 'instructor' && state.activeTab === 'students' && <StudentsTable />}
          {state.role === 'instructor' && state.activeTab === 'analytics' && <AnalyticsPage courses={state.courses} />}

          {state.role === 'admin' && state.activeTab === 'dashboard' && <AdminDashboard users={state.users} courses={state.courses} />}
          {state.role === 'admin' && state.activeTab === 'users' && <AdminUsers users={state.users} onUsers={actions.setUsers} />}
          {state.role === 'admin' && state.activeTab === 'courses' && <AdminCourses courses={state.courses} />}
          {state.role === 'admin' && state.activeTab === 'reports' && <AnalyticsPage courses={state.courses} />}
          {state.role === 'admin' && state.activeTab === 'settings' && <AdminSettings />}

          {state.activeTab === 'profile' && <ProfilePage profile={state.profile} onSave={actions.saveProfile} />}
        </div>
      </main>

      {state.showCourseModal && <CourseModal editing={state.editingCourse} form={state.courseForm} onChange={actions.setCourseForm} onClose={actions.closeCourseModal} onSave={actions.saveCourse} />}
    </>
  );
}
