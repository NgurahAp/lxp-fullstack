import bcrypt from "bcrypt";
import { prismaClient } from "../application/database";

const createTestUser = async (email = "test@gmail.com") => {
  // First try to remove any existing test user to avoid conflicts
  try {
    // We need to delete related records first to avoid foreign key constraints
    await prismaClient.training_Users.deleteMany({
      where: {
        user: {
          email: email,
        },
      },
    });

    await prismaClient.user.deleteMany({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.log(`Error cleaning up existing user: ${error.message}`);
  }

  return prismaClient.user.create({
    data: {
      email: email,
      password: await bcrypt.hash("password", 10),
      name: "test",
      token: "test",
      resetToken: "test",
      resetTokenExpiration: new Date(Date.now() + 3600000),
    },
  });
};

const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      email: "test@gmail.com",
    },
  });
};

const getTestInstructor = async () => {
  return prismaClient.user.findUnique({
    where: {
      email: "instructor@test.com",
    },
  });
};

const removeTestUser = async () => {
  // First delete related records
  await prismaClient.moduleSubmission.deleteMany({
    where: {
      trainingUser: {
        user: {
          email: "test@gmail.com",
        },
      },
    },
  });

  await prismaClient.quizSubmission.deleteMany({
    where: {
      trainingUser: {
        user: {
          email: "test@gmail.com",
        },
      },
    },
  });

  await prismaClient.taskSubmission.deleteMany({
    where: {
      trainingUser: {
        user: {
          email: "test@gmail.com",
        },
      },
    },
  });

  await prismaClient.score.deleteMany({
    where: {
      trainingUser: {
        user: {
          email: "test@gmail.com",
        },
      },
    },
  });

  await prismaClient.training_Users.deleteMany({
    where: {
      user: {
        email: "test@gmail.com",
      },
    },
  });

  await prismaClient.user.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};

const getInstructorTrainings = async (instructorId) => {
  return prismaClient.training.findMany({
    where: {
      instructorId: instructorId,
    },
  });
};

// Fungsi untuk mendapatkan jumlah student dalam training
const getTrainingStudentsCount = async (trainingId) => {
  return prismaClient.training_Users.count({
    where: {
      trainingId: trainingId,
    },
  });
};

// Fungsi untuk membuat multiple training users sekaligus
const createMultipleTrainingUsers = async (trainingId, userIds) => {
  const promises = userIds.map((userId) =>
    prismaClient.training_Users.create({
      data: {
        trainingId: trainingId,
        userId: userId,
        status: "enrolled",
      },
    })
  );
  return Promise.all(promises);
};

// Fungsi untuk membuat beberapa test students
const createMultipleTestStudents = async (count = 5) => {
  // First clean up any existing test students
  await removeTestStudents();

  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(
      prismaClient.user.create({
        data: {
          name: `Student ${i + 1}`,
          email: `student${i + 1}@test.com`,
          password: "hashedpassword",
          role: "student",
        },
      })
    );
  }
  return Promise.all(promises);
};

const removeTestStudents = async () => {
  // First delete related records
  await prismaClient.moduleSubmission.deleteMany({
    where: {
      trainingUser: {
        user: {
          email: {
            contains: "student",
            endsWith: "@test.com",
          },
        },
      },
    },
  });

  await prismaClient.quizSubmission.deleteMany({
    where: {
      trainingUser: {
        user: {
          email: {
            contains: "student",
            endsWith: "@test.com",
          },
        },
      },
    },
  });

  await prismaClient.taskSubmission.deleteMany({
    where: {
      trainingUser: {
        user: {
          email: {
            contains: "student",
            endsWith: "@test.com",
          },
        },
      },
    },
  });

  await prismaClient.score.deleteMany({
    where: {
      trainingUser: {
        user: {
          email: {
            contains: "student",
            endsWith: "@test.com",
          },
        },
      },
    },
  });

  await prismaClient.training_Users.deleteMany({
    where: {
      user: {
        email: {
          contains: "student",
          endsWith: "@test.com",
        },
      },
    },
  });

  return prismaClient.user.deleteMany({
    where: {
      email: {
        contains: "student",
        endsWith: "@test.com",
      },
    },
  });
};

const createTestInstructor = async () => {
  // First try to remove any existing test instructor and associated data
  try {
    // Delete trainings and associated records created by this instructor
    const instructor = await prismaClient.user.findFirst({
      where: {
        email: "instructor@test.com",
      },
      select: {
        id: true,
      },
    });

    if (instructor) {
      // Get training ids created by this instructor
      const trainings = await prismaClient.training.findMany({
        where: {
          instructorId: instructor.id,
        },
        select: {
          id: true,
        },
      });

      const trainingIds = trainings.map((t) => t.id);

      // Delete all related records for these trainings
      if (trainingIds.length > 0) {
        // Get meeting ids for these trainings
        const meetings = await prismaClient.meeting.findMany({
          where: {
            trainingId: {
              in: trainingIds,
            },
          },
          select: {
            id: true,
          },
        });

        const meetingIds = meetings.map((m) => m.id);

        // Delete records that depend on meetings
        if (meetingIds.length > 0) {
          await prismaClient.moduleSubmission.deleteMany({
            where: {
              module: {
                meetingId: {
                  in: meetingIds,
                },
              },
            },
          });

          await prismaClient.quizSubmission.deleteMany({
            where: {
              quiz: {
                meetingId: {
                  in: meetingIds,
                },
              },
            },
          });

          await prismaClient.taskSubmission.deleteMany({
            where: {
              task: {
                meetingId: {
                  in: meetingIds,
                },
              },
            },
          });

          await prismaClient.score.deleteMany({
            where: {
              meetingId: {
                in: meetingIds,
              },
            },
          });

          await prismaClient.module.deleteMany({
            where: {
              meetingId: {
                in: meetingIds,
              },
            },
          });

          await prismaClient.quiz.deleteMany({
            where: {
              meetingId: {
                in: meetingIds,
              },
            },
          });

          await prismaClient.task.deleteMany({
            where: {
              meetingId: {
                in: meetingIds,
              },
            },
          });

          await prismaClient.meeting.deleteMany({
            where: {
              id: {
                in: meetingIds,
              },
            },
          });
        }

        // Delete training_users for these trainings
        await prismaClient.training_Users.deleteMany({
          where: {
            trainingId: {
              in: trainingIds,
            },
          },
        });

        // Delete the trainings themselves
        await prismaClient.training.deleteMany({
          where: {
            id: {
              in: trainingIds,
            },
          },
        });
      }
    }

    // Finally delete the instructor
    await prismaClient.user.deleteMany({
      where: {
        email: "instructor@test.com",
      },
    });
  } catch (error) {
    console.log(`Error cleaning up existing instructor: ${error.message}`);
  }

  return prismaClient.user.create({
    data: {
      name: "test instructor",
      email: "instructor@test.com",
      password: await bcrypt.hash("hashedpassword", 10),
      role: "instructor",
      token: "test-instructor",
    },
  });
};

const removeTestInstructor = async () => {
  // Same implementation as in the beginning of createTestInstructor
  try {
    const instructor = await prismaClient.user.findFirst({
      where: {
        email: "instructor@test.com",
      },
      select: {
        id: true,
      },
    });

    if (instructor) {
      // Get training ids created by this instructor
      const trainings = await prismaClient.training.findMany({
        where: {
          instructorId: instructor.id,
        },
        select: {
          id: true,
        },
      });

      const trainingIds = trainings.map((t) => t.id);

      // Delete all related records for these trainings
      if (trainingIds.length > 0) {
        // Get meeting ids for these trainings
        const meetings = await prismaClient.meeting.findMany({
          where: {
            trainingId: {
              in: trainingIds,
            },
          },
          select: {
            id: true,
          },
        });

        const meetingIds = meetings.map((m) => m.id);

        // Delete records that depend on meetings
        if (meetingIds.length > 0) {
          await prismaClient.moduleSubmission.deleteMany({
            where: {
              module: {
                meetingId: {
                  in: meetingIds,
                },
              },
            },
          });

          await prismaClient.quizSubmission.deleteMany({
            where: {
              quiz: {
                meetingId: {
                  in: meetingIds,
                },
              },
            },
          });

          await prismaClient.taskSubmission.deleteMany({
            where: {
              task: {
                meetingId: {
                  in: meetingIds,
                },
              },
            },
          });

          await prismaClient.score.deleteMany({
            where: {
              meetingId: {
                in: meetingIds,
              },
            },
          });

          await prismaClient.module.deleteMany({
            where: {
              meetingId: {
                in: meetingIds,
              },
            },
          });

          await prismaClient.quiz.deleteMany({
            where: {
              meetingId: {
                in: meetingIds,
              },
            },
          });

          await prismaClient.task.deleteMany({
            where: {
              meetingId: {
                in: meetingIds,
              },
            },
          });

          await prismaClient.meeting.deleteMany({
            where: {
              id: {
                in: meetingIds,
              },
            },
          });
        }

        // Delete training_users for these trainings
        await prismaClient.training_Users.deleteMany({
          where: {
            trainingId: {
              in: trainingIds,
            },
          },
        });

        // Delete the trainings themselves
        await prismaClient.training.deleteMany({
          where: {
            id: {
              in: trainingIds,
            },
          },
        });
      }
    }

    return prismaClient.user.deleteMany({
      where: {
        email: "instructor@test.com",
      },
    });
  } catch (error) {
    console.log(`Error removing instructor: ${error.message}`);
  }
};

// New Training User utilities
const createTrainingUser = async (trainingId, userId) => {
  return prismaClient.training_Users.create({
    data: {
      trainingId: trainingId,
      userId: userId,
      status: "enrolled",
    },
  });
};

const createModuleSubmission = async (meetingId, trainingUserId) => {
  const module = await prismaClient.module.findFirst({
    where: { meetingId: meetingId },
  });

  return prismaClient.moduleSubmission.create({
    data: {
      moduleId: module.id,
      trainingUserId: trainingUserId,
      score: 0,
    },
  });
};

const removeTrainingUser = async () => {
  // First remove child records
  await prismaClient.moduleSubmission.deleteMany({
    where: {},
  });

  await prismaClient.quizSubmission.deleteMany({
    where: {},
  });

  await prismaClient.taskSubmission.deleteMany({
    where: {},
  });

  await prismaClient.score.deleteMany({
    where: {},
  });

  return prismaClient.training_Users.deleteMany();
};

// Training utilities
const createTraining = async (instructorId) => {
  return prismaClient.training.create({
    data: {
      title: "test training",
      description: "test description",
      instructorId: instructorId,
    },
  });
};

const removeTraining = async () => {
  // We need to remove dependent records first
  await removeTrainingUser();
  await removeMeeting();
  return prismaClient.training.deleteMany();
};

// New Meeting utilities
const createMeeting = async (trainingId) => {
  return prismaClient.meeting.create({
    data: {
      trainingId: trainingId,
      title: "Test Meeting",
      meetingDate: new Date(),
    },
  });
};

const removeMeeting = async () => {
  // Remove dependent records first
  await removeModule();
  await removeQuiz();
  await removeTask();
  await removeScore();
  return prismaClient.meeting.deleteMany();
};

// New Module utilities
const createModule = async (meetingId) => {
  return prismaClient.module.create({
    data: {
      meetingId: meetingId,
      title: "Test Module",
      content: "modules/test.pdf",
    },
  });
};

// Module Submission utilities
const removeModuleSubmissions = async () => {
  return prismaClient.moduleSubmission.deleteMany();
};

const removeModule = async () => {
  // First remove all module submissions to avoid foreign key constraints
  await removeModuleSubmissions();
  return prismaClient.module.deleteMany();
};

// Quiz utilities
const createQuiz = async (meetingId) => {
  return prismaClient.quiz.create({
    data: {
      meetingId: meetingId,
      title: "Test Quiz",
      questions: [
        {
          question: "Question 1?",
          options: ["A", "B", "C", "D"],
          correctAnswer: 0,
        },
        {
          question: "Question 2?",
          options: ["A", "B", "C", "D"],
          correctAnswer: 1,
        },
        {
          question: "Question 3?",
          options: ["A", "B", "C", "D"],
          correctAnswer: 2,
        },
        {
          question: "Question 4?",
          options: ["A", "B", "C", "D"],
          correctAnswer: 1,
        },
        {
          question: "Question 5?",
          options: ["A", "B", "C", "D"],
          correctAnswer: 3,
        },
      ],
    },
  });
};

// Quiz Submission utilities
const removeQuizSubmissions = async () => {
  return prismaClient.quizSubmission.deleteMany();
};

const removeQuiz = async () => {
  // First remove all quiz submissions to avoid foreign key constraints
  await removeQuizSubmissions();
  return prismaClient.quiz.deleteMany();
};

// Task utilities
const createTask = async (meetingId) => {
  return prismaClient.task.create({
    data: {
      meetingId: meetingId,
      title: "Test Task",
      taskQuestion: "Sebutkan 5 rukun islam",
    },
  });
};

const createTaskSubmission = async (meetingId, trainingUserId) => {
  const task = await prismaClient.task.findFirst({
    where: { meetingId: meetingId },
  });

  return prismaClient.taskSubmission.create({
    data: {
      taskId: task.id,
      trainingUserId: trainingUserId,
      score: 0,
    },
  });
};

// Task Submission utilities
const removeTaskSubmissions = async () => {
  return prismaClient.taskSubmission.deleteMany();
};

const removeTask = async () => {
  // First remove all task submissions to avoid foreign key constraints
  await removeTaskSubmissions();
  return prismaClient.task.deleteMany();
};

// Score utilities
const createInitScore = async (trainingUserId, meetingId) => {
  return prismaClient.score.create({
    data: {
      trainingUserId: trainingUserId,
      meetingId: meetingId,
      moduleScore: 0,
      quizScore: 0,
      taskScore: 0,
      totalScore: 0,
    },
  });
};

const createScore = async (trainingUserId, meetingId) => {
  return prismaClient.score.create({
    data: {
      trainingUserId: trainingUserId,
      meetingId: meetingId,
      moduleScore: 85,
      quizScore: 90,
      taskScore: 95,
      totalScore: 90, // (85 + 90 + 95) / 3
    },
  });
};

const removeScore = async () => {
  return prismaClient.score.deleteMany();
};

// Main cleanup utility
const removeAll = async () => {
  // Order matters here - need to remove related records first
  // Bottom-up deletion approach
  await removeModuleSubmissions();
  await removeQuizSubmissions();
  await removeTaskSubmissions();
  await removeScore();
  await removeModule();
  await removeQuiz();
  await removeTask();
  await removeMeeting();
  await removeTrainingUser();
  await removeTraining();
  await removeTestStudents();
  await removeTestUser();
  await removeTestInstructor();
};

export {
  removeTestUser,
  createTestUser,
  createTestInstructor,
  removeTestInstructor,
  getTestUser,
  getTestInstructor,
  getInstructorTrainings,
  getTrainingStudentsCount,
  createMultipleTestStudents,
  createMultipleTrainingUsers,
  removeTestStudents,
  createTraining,
  removeTraining,
  createMeeting,
  removeMeeting,
  createModule,
  removeModule,
  createTrainingUser,
  removeTrainingUser,
  removeAll,
  createQuiz,
  removeQuiz,
  createTask,
  createScore,
  createInitScore,
  removeModuleSubmissions,
  removeQuizSubmissions,
  removeTaskSubmissions,
  createModuleSubmission,
  createTaskSubmission,
};
