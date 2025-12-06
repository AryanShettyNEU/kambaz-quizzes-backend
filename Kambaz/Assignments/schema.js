import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    modules: {
      type: String,
      default: "",
    },
    availableDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    untilDate: {
      type: Date,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { collection: "assignments" }
);

export default assignmentSchema;
