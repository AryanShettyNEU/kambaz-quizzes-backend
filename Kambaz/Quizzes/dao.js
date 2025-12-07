import model from "./model.js";

export default function QuizzesDao() {
  const createQuiz = async (quiz) => {
    return await model.create(quiz);
  };

  const findQuizzesForCourse = async (courseId) => {
    return await model.aggregate([
      { $match: { course: courseId } },
      { $sort: { availableDate: 1 } },
      {
        $addFields: {
          questionCount: { $size: "$questions" },
        },
      },
      {
        $project: {
          questions: 0,
        },
      },
    ]);
  };

  const findQuizById = async (quizId) => {
    return await model.findById(quizId);
  };

  const findQuizByIdWithoutCorrectness = async (quizId) => {
    return await model.findById(quizId, {
      "questions.options.isCorrect": 0,
    });
  };

  const updateQuiz = async (quizId, quizUpdates) => {
    return await model.updateOne({ _id: quizId }, { $set: quizUpdates });
  };

  const deleteQuiz = async (quizId) => {
    return await model.deleteOne({ _id: quizId });
  };

  const setQuizPublishStatus = async (quizId, published) => {
    return await model.updateOne(
      { _id: quizId },
      { $set: { published: published } }
    );
  };

  const addQuestionToQuiz = async (quizId, question) => {
    return await model.findOneAndUpdate(
      { _id: quizId },
      { $push: { questions: question } },
      { new: true }
    );
  };

  const updateQuestionInQuiz = async (quizId, questionId, updates) => {
    return await model.findOneAndUpdate(
      { _id: quizId, "questions._id": questionId },
      { $set: { "questions.$": updates } },
      { new: true }
    );
  };

  const deleteQuestionFromQuiz = async (quizId, questionId) => {
    return await model.findOneAndUpdate(
      { _id: quizId },
      { $pull: { questions: { _id: questionId } } },
      { new: true }
    );
  };

  return {
    createQuiz,
    findQuizzesForCourse,
    findQuizByIdWithoutCorrectness,
    findQuizById,
    updateQuiz,
    deleteQuiz,
    setQuizPublishStatus,
    addQuestionToQuiz,
    updateQuestionInQuiz,
    deleteQuestionFromQuiz,
  };
}
