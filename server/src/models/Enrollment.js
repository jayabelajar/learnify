import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
