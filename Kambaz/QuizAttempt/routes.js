import StudentQuizAttemptDao from "./dao.js";

export default function StudentQuizAttemptRoutes(app) {
  const dao = StudentQuizAttemptDao();

  const getCurrentUserId = (req) => {
    const user = req.session["currentUser"];
    return user?._id ?? null;
  };

  const submitAttempt = async (req, res) => {
    const studentId = getCurrentUserId(req);
    if (!studentId) return res.sendStatus(401);

    try {
      const attempt = await dao.submitAttempt(
        studentId,
        req.params.quizId,
        req.body.answers
      );
      res.json(attempt);
    } catch (err) {
      if (err.code === "MAX_ATTEMPTS")
        return res.status(403).json({ message: err.message });
      if (err.code === "NOT_FOUND") return res.sendStatus(404);
      console.log(err);
      res.sendStatus(500);
    }
  };

  const getLastAttempt = async (req, res) => {
    const studentId = getCurrentUserId(req);
    if (!studentId) return res.sendStatus(401);

    const { quizId } = req.params;
    const lastAttempt = await dao.findLastAttemptWithQuestions(
      studentId,
      quizId
    );
    if (!lastAttempt) return res.sendStatus(404);

    res.json(lastAttempt);
  };

  const getAllAttempts = async (req, res) => {
    const studentId = getCurrentUserId(req);
    if (!studentId) return res.sendStatus(401);

    const { quizId } = req.params;
    const attempts = await dao.findAttemptsByStudentQuiz(studentId, quizId);
    res.json(attempts);
  };

  const deleteAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const status = await dao.deleteAttempt(attemptId);
    res.json(status);
  };

  const getAttemptCount = async (req, res) => {
    const studentId = getCurrentUserId(req);
    if (!studentId) return res.sendStatus(401);

    const { quizId } = req.params;
    const attempts = await dao.countAttempts(studentId, quizId);
    res.json(attempts);
  };

  const getAttemptById = async (req, res) => {
    const studentId = getCurrentUserId(req);
    if (!studentId) return res.sendStatus(401);

    const { attemptId } = req.params;
    try {
      const attempts = await dao.findAttemptById(studentId, attemptId);
      res.json(attempts);
    } catch (err) {
      if (err.code === "UNAUTHORIZED") {
        return res.status(401).json({ message: err.message });
      }
      res.sendStatus(500);
    }
  };

  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
  app.get("/api/quizzes/:quizId/attempts/last", getLastAttempt);
  app.get("/api/quizzes/:quizId/attempts/count", getAttemptCount);
  app.get("/api/quizzes/:quizId/attempts", getAllAttempts);
  app.get("/api/quizzes/attempt/:attemptId", getAttemptById);
  //   app.delete("/api/attempts/:attemptId", deleteAttempt);
}
