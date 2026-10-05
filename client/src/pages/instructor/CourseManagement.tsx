import { Edit3, Eye, LibraryBig, Search, Trash2 } from 'lucide-react';
import type { Course } from '../../types';
import { Badge } from '../../components/common/Badge';
import { IconButton } from '../../components/common/IconButton';
import { Panel } from '../../components/common/Panel';

type CourseManagementProps = {
  courses: Course[];
  search: string;
  onSearch: (value: string) => void;
  onCreate: () => void;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onTogglePublish: (courseId: string) => void;
  onManage: (courseId: string) => void;
};

export function CourseManagement({ courses, search, onSearch, onCreate, onEdit, onDelete, onTogglePublish, onManage }: CourseManagementProps) {
  return (
    <Panel>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => onSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500" placeholder="Search your courses..." />
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white" onClick={onCreate}>
          Create Course
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
            <tr>
              <th className="py-3">Course</th>
              <th>Status</th>
              <th>Students</th>
              <th>Modules</th>
              <th>Lessons</th>
              <th>Completion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img className="h-12 w-16 rounded-lg object-cover" src={course.thumbnail} alt={course.title} />
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-xs text-slate-500">
                        {course.category} - {course.level}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge tone={course.status === 'published' ? 'green' : 'gray'}>{course.status}</Badge>
                </td>
                <td>{course.studentsCount}</td>
                <td>{course.modules.length}</td>
                <td>{course.modules.flatMap((module) => module.lessons).length}</td>
                <td>{course.completionRate}%</td>
                <td>
                  <div className="flex items-center gap-1">
                    <IconButton label="Edit" icon={Edit3} onClick={() => onEdit(course)} />
                    <IconButton label="Manage content" icon={LibraryBig} onClick={() => onManage(course.id)} />
                    <IconButton label="Publish" icon={Eye} onClick={() => onTogglePublish(course.id)} />
                    <IconButton label="Delete" icon={Trash2} danger onClick={() => onDelete(course.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
