import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
