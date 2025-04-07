import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import {
  getDetailStudentValidation,
  getStudentsValidation,
} from "../validation/student-validation.js";

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

const getDetailStudent = async (user, request) => {
  const validationResult = validate(getDetailStudentValidation, request);
  const { studentId } = validationResult;

  const student = await prismaClient.user.findUnique({
    where: {
      id: studentId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      updatedAt: true,
      trainingUsers: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!student) {
    throw new ResponseError(404, "Student data not found");
  }

  // Get enrolled courses count
  const enrolledCourses = await prismaClient.training_Users.count({
    where: {
      userId: studentId,
    },
  });

  // Get training user IDs for this student to use in subsequent queries
  const trainingUserRecords = await prismaClient.training_Users.findMany({
    where: {
      userId: studentId,
    },
    select: {
      id: true,
    },
  });

  const trainingUserIds = trainingUserRecords.map((record) => record.id);

  // Count completed courses
  const completedCourses = await prismaClient.training_Users.count({
    where: {
      userId: studentId,
      status: "completed",
    },
  });

  // Count pending assignments (module, quiz, task submissions)
  const pendingModules = await prismaClient.moduleSubmission.count({
    where: {
      trainingUserId: {
        in: trainingUserIds,
      },
      score: 0,
    },
  });

  const pendingQuizzes = await prismaClient.quizSubmission.count({
    where: {
      trainingUserId: {
        in: trainingUserIds,
      },
      score: 0,
    },
  });

  const pendingTasks = await prismaClient.taskSubmission.count({
    where: {
      trainingUserId: {
        in: trainingUserIds,
      },
      score: 0,
    },
  });

  const pendingAssignments = pendingModules + pendingQuizzes + pendingTasks;

  const profile = {
    studentId: student.id,
    name: student.name,
    email: student.email,
    enrolledCourses,
    completedCourses,
    pendingAssignments,
    status: student.status || "active", // Added default status if not present in the model
    lastActive: student.updatedAt.toISOString(),
  };

  // Get module submissions for all training user records
  const modules = await prismaClient.moduleSubmission.findMany({
    where: {
      trainingUserId: {
        in: trainingUserIds,
      },
    },
    select: {
      id: true,
      answer: true,
      score: true,
      updatedAt: true,
      module: {
        select: {
          title: true,
        },
      },
    },
  });

  // Get quiz submissions for all training user records
  const quizzes = await prismaClient.quizSubmission.findMany({
    where: {
      trainingUserId: {
        in: trainingUserIds,
      },
    },
    select: {
      id: true,
      score: true,
      updatedAt: true,
      quiz: {
        select: {
          title: true,
        },
      },
    },
  });

  // Get task submissions for all training user records
  const tasks = await prismaClient.taskSubmission.findMany({
    where: {
      trainingUserId: {
        in: trainingUserIds,
      },
    },
    select: {
      id: true,
      answer: true,
      score: true,
      updatedAt: true,
      task: {
        select: {
          title: true,
          taskQuestion: true,
        },
      },
    },
  });

  return {
    data: {
      profile: profile,
      modules: modules,
      quizzes: quizzes,
      tasks: tasks,
    },
  };
};

export default {
  getInstructorStudents,
  getDetailStudent,
};
