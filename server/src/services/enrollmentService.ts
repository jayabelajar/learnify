import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';

export async function recomputeEnrollmentProgress(enrollment) {
  const modules = await Module.find({ course: enrollment.course }).select('_id');
  const totalLessons = await Lesson.countDocuments({ module: { $in: modules.map((mod) => mod._id) } });
  const completed = enrollment.completedLessons.length;

  enrollment.progress = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
  enrollment.status = enrollment.progress === 100 ? 'completed' : enrollment.progress > 0 ? 'in_progress' : 'not_started';
  enrollment.completedAt = enrollment.progress === 100 ? new Date() : undefined;

  await enrollment.save();
  return enrollment;
}
