import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    instructions: { type: String, default: '' },
    dueDate: { type: Date },
    points: { type: Number, default: 100 },
    status: { type: String, enum: ['draft', 'published', 'closed'], default: 'draft' }
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);
