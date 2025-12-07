// req.session["currentUser"]
import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();

  const requireUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return null;
    }
    return currentUser;
  };

  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizByIdWithoutCorrectness(quizId);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }
    res.json(quiz);
  };

  const findQuizByIdAdmin = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }
    res.json(quiz);
  };

  const createQuiz = async (req, res) => {
    const quiz = req.body;
    const newQuiz = await dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const update = await dao.updateQuiz(quizId, req.body);
    res.json(update);
  };

  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };

  const setQuizPublishStatus = async (req, res) => {
    // const currentUser = requireUser(req, res);
    // if (!currentUser) return;
    const { quizId } = req.params;
    const { published } = req.body;
    const result = await dao.setQuizPublishStatus(quizId, published);
    res.json(result);
  };

  const addQuestion = async (req, res) => {
    // const currentUser = requireUser(req, res);
    // if (!currentUser) return;
    const { quizId } = req.params;
    const question = req.body;
    const updatedQuiz = await dao.addQuestionToQuiz(quizId, question);
    res.json(updatedQuiz);
  };

  const updateQuestion = async (req, res) => {
    // const currentUser = requireUser(req, res);
    // if (!currentUser) return;
    const { quizId, questionId } = req.params;
    const updates = req.body;
    const updatedQuiz = await dao.updateQuestionInQuiz(
      quizId,
      questionId,
      updates
    );
    res.json(updatedQuiz);
  };

  const deleteQuestion = async (req, res) => {
    // const currentUser = requireUser(req, res);
    // if (!currentUser) return;
    const { quizId, questionId } = req.params;
    const updatedQuiz = await dao.deleteQuestionFromQuiz(quizId, questionId);
    res.json(updatedQuiz);
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);

  app.get("/api/quizzes/:quizId", findQuizById);

  app.get("/api/quizzes/:quizId/admin", findQuizByIdAdmin);

  app.post("/api/quizzes", createQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);

  app.put("/api/quizzes/:quizId/publish", setQuizPublishStatus);

  app.post("/api/quizzes/:quizId/questions", addQuestion);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}
