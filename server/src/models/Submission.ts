import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, default: '' },
    attachmentUrl: { type: String, default: '' },
    grade: { type: Number, default: null },
    feedback: { type: String, default: '' },
    status: { type: String, enum: ['submitted', 'reviewed', 'returned'], default: 'submitted' },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Submission', submissionSchema);
