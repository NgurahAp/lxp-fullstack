import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import { getStudentsValidation } from "../validation/student-validation.js";

const getInstructorStudents = async (user, request) => {
  const option = validate(getStudentsValidation, request);

  const skip = (option.page - 1) * option.size;

  // First get all trainings by this instructor
  const instructorTrainings = await prismaClient.training.findMany({
    where: {
      instructorId: user.id,
    },
    select: {
      id: true,
    },
  });

  const trainingIds = instructorTrainings.map((training) => training.id);

  // Base where condition for students
  const where = {
    trainingId: {
      in: trainingIds,
    },
  };

  // Add status filter if provided
  if (option.status) {
    where.status = option.status;
  }

  // Count total students
  const total = await prismaClient.training_Users.count({
    where,
  });

  // Get students with required data
  const students = await prismaClient.training_Users.findMany({
    where,
    skip,
    take: option.size,
    select: {
      id: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          updatedAt: true,
        },
      },
      training: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  // Fetch additional statistics for each student
  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      // Count enrolled courses
      const enrolledCourses = await prismaClient.training_Users.count({
        where: {
          userId: student.user.id,
        },
      });

      // Count completed courses
      const completedCourses = await prismaClient.training_Users.count({
        where: {
          userId: student.user.id,
          status: "completed",
        },
      });

      // Count pending assignments (module, quiz, task submissions)
      const pendingModules = await prismaClient.moduleSubmission.count({
        where: {
          trainingUserId: student.id,
          score: 0,
        },
      });

      const pendingQuizzes = await prismaClient.quizSubmission.count({
        where: {
          trainingUserId: student.id,
          score: 0,
        },
      });

      const pendingTasks = await prismaClient.taskSubmission.count({
        where: {
          trainingUserId: student.id,
          score: 0,
        },
      });

      const pendingAssignments = pendingModules + pendingQuizzes + pendingTasks;

      return {
        id: student.user.id,
        name: student.user.name,
        email: student.user.email,
        enrolledCourses,
        completedCourses,
        pendingAssignments,
        status: student.status,
        lastActive: student.user.updatedAt.toISOString(),
      };
    })
  );

  return {
    data: {
      students: studentsWithStats,
    },
    paging: {
      page: option.page,
      total_items: total,
      total_pages: Math.ceil(total / option.size),
    },
  };
};

export default {
  getInstructorStudents,
};
