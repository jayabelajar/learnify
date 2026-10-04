import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    points: { type: Number, default: 1 }
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    passingScore: { type: Number, default: 70 },
    timeLimit: { type: Number },
    questions: [questionSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);
