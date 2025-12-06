import model from "./model.js";
export default function EnrollmentsDao() {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }
  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  async function enrollUserInCourse(userId, courseId) {
    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  }
  async function unEnrollUserInCourse(user, course) {
    return model.deleteOne({ user, course });
  }
  async function fetchAllEnrollments(userId) {
    const enrollments = await model.find({ user: userId });
    return enrollments;
  }
  async function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    enrollUserInCourse,
    unEnrollUserInCourse,
    fetchAllEnrollments,
    findCoursesForUser,
    findUsersForCourse,
    unenrollAllUsersFromCourse,
  };
}
