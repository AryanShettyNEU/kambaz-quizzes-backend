import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    points: { type: Number, default: 0 },
    questionText: { type: String },
    type: {
      type: String,
      enum: ["MCQ", "TRUE_FALSE", "FIB"],
      required: true,
    },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
  },
  { collection: "questions" }
);

export default questionSchema;
