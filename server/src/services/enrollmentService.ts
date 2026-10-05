import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import Certificate from '../models/Certificate.js';

export async function recomputeEnrollmentProgress(enrollment) {
  const modules = await Module.find({ course: enrollment.course }).select('_id');
  const totalLessons = await Lesson.countDocuments({ module: { $in: modules.map((mod) => mod._id) } });
  const completed = enrollment.completedLessons.length;

  enrollment.progress = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
  enrollment.status = enrollment.progress === 100 ? 'completed' : enrollment.progress > 0 ? 'in_progress' : 'not_started';
  enrollment.completedAt = enrollment.progress === 100 ? new Date() : undefined;

  await enrollment.save();
  if (enrollment.status === 'completed') {
    await Certificate.findOneAndUpdate(
      { student: enrollment.student, course: enrollment.course },
      {
        $setOnInsert: {
          certificateId: `LRN-${Date.now().toString(36).toUpperCase()}`,
          student: enrollment.student,
          course: enrollment.course,
          status: 'issued'
        }
      },
      { upsert: true, new: true }
    );
  }
  return enrollment;
}
