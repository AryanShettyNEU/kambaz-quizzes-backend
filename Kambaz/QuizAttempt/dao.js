import model from "./model.js";
import QuizDao from "../Quizzes/dao.js";

export default function StudentQuizAttemptDao() {
  const quizDao = QuizDao();
  const createAttempt = async ({ user, quiz, answers, score, maxAttempts }) => {
    const attemptCount = await model.countDocuments({
      user,
      quiz,
    });
    if (maxAttempts && attemptCount >= maxAttempts) {
      return null;
    }
    const attemptNumber = attemptCount + 1;
    return await model.create({
      user,
      quiz,
      attemptNumber,
      answers,
      score,
      submittedAt: new Date(),
    });
  };

  function isCorrect(question, userAnswer) {
    const correctValues = question.options
      .filter((o) => o.isCorrect)
      .map((o) => String(o.text));

    return correctValues.includes(String(userAnswer));
  }

  async function submitAttempt(studentId, quizId, answers) {
    const quiz = await quizDao.findQuizById(quizId);
    if (!quiz) {
      const err = new Error("Quiz not found");
      err.code = "NOT_FOUND";
      throw err;
    }

    const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
    const existing = await countAttempts(studentId, quizId);

    if (existing >= maxAttempts) {
      const err = new Error("Maximum attempts reached");
      err.code = "MAX_ATTEMPTS";
      throw err;
    }

    let score = 0;

    const processedAnswers = answers.map((ans) => {
      const q = quiz.questions.id(ans.questionId);
      if (!q)
        return {
          questionId: ans.questionId,
          answer: ans.answer,
          isCorrect: false,
        };

      const correct = isCorrect(q, ans.answer);

      if (correct) score += q.points || 0;

      return {
        questionId: q._id,
        answer: ans.answer,
        isCorrect: correct,
      };
    });

    return await createAttempt({
      user: studentId,
      quiz: quizId,
      answers: processedAnswers,
      score,
    });
  }

  const findAttemptsByStudentQuiz = async (studentId, quizId) => {
    return await model
      .find({
        user: studentId,
        quiz: quizId,
      })
      .sort({ attemptNumber: 1 });
  };

  const findLastAttemptWithQuestions = async (studentId, quizId) => {
    const attempt = await model
      .findOne({
        user: studentId,
        quiz: quizId,
      })
      .sort({ attemptNumber: -1 });
    if (!attempt) return null;
    const quiz = await quizDao.findQuizById(quizId);
    const populatedAnswers = attempt.answers.map((ans) => {
      const question = quiz.questions.id(ans.questionId);
      if (!question) return ans.toObject();
      return {
        ...ans.toObject(),
        question: {
          _id: question._id,
          title: question.title,
          type: question.type,
          questionText: question.questionText,
          options: question.options,
        },
      };
    });
    const attemptObj = attempt.toObject();
    attemptObj.answers = populatedAnswers;
    return attemptObj;
  };

  const countAttempts = async (studentId, quizId) => {
    return await model.countDocuments({
      user: studentId,
      quiz: quizId,
    });
  };

  const deleteAttempt = async (attemptId) => {
    return await model.deleteOne({ _id: attemptId });
  };

  const findAttemptById = async (studentId, attemptId) => {
    const attempt = await model.findById(attemptId);
    if (attempt.user !== studentId) {
      const err = new Error("Attempt does not belong to the student.");
      err.code = "UNAUTHORIZED";
      throw err;
    }
    const quiz = await quizDao.findQuizByIdWithoutCorrectness(attempt.quiz);
    const populatedAnswers = attempt.answers.map((ans) => {
      const question = quiz.questions.id(ans.questionId);
      if (!question) return ans.toObject();
      return {
        ...ans.toObject(),
        question: {
          _id: question._id,
          title: question.title,
          type: question.type,
          questionText: question.questionText,
          options: question.options,
          points: question.points,
        },
      };
    });
    const attemptObj = attempt.toObject();
    attemptObj.answers = populatedAnswers;
    return attemptObj;
  };

  return {
    findAttemptsByStudentQuiz,
    findLastAttemptWithQuestions,
    countAttempts,
    deleteAttempt,
    submitAttempt,
    findAttemptById,
  };
}
