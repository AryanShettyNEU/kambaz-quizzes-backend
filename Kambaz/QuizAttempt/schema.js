import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "UserModel", required: true },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizModel",
      required: true,
    },
    attemptNumber: { type: Number, required: true },
    score: { type: Number, default: 0 },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        answer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
