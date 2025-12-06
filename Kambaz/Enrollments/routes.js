import EnrollmentsDao from "./dao.js";
export default function EnrollmentRoutes(app) {
  const dao = EnrollmentsDao();
  const unEnrollCourse = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const status = await dao.unEnrollUserInCourse(userId, courseId);
    res.send(status);
  };
  const enrollCourse = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const status = await dao.enrollUserInCourse(userId, courseId);
    res.send(status);
  };

  const fetchAllEnrollments = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const enrollments = await dao.fetchAllEnrollments(userId);
    res.json(enrollments);
  };

  app.delete("/api/users/:userId/enrollments/:courseId", unEnrollCourse);
  app.put("/api/users/:userId/enrollments/:courseId", enrollCourse);
  app.get("/api/users/:userId/enrollments", fetchAllEnrollments);
}
