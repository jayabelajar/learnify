import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
    status: { type: String, enum: ['visible', 'hidden'], default: 'visible' }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
