import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['article', 'video', 'quiz', 'submission'], default: 'article' },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    resourceUrl: { type: String, default: '' },
    submissionInstructions: { type: String, default: '' },
    quiz: {
      title: { type: String, default: '' },
      passingScore: { type: Number, default: 70 },
      questions: [
        {
          question: { type: String, required: true },
          options: [{ type: String }],
          correctAnswer: { type: Number, default: 0 }
        }
      ]
    },
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Lesson', lessonSchema);
