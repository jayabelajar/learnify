import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['video', 'text', 'pdf'], default: 'text' },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    resourceUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Lesson', lessonSchema);
