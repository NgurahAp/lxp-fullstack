import { prismaClient } from "../application/database.js";
import {
  createTrainingUserValidation,
  createTrainingValidation,
  getInstructorTrainingsValidation,
  getStudentTrainingsValidation,
  getTrainingDetailValidation,
  updateTrainingValidation,
} from "../validation/training-validation.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import path from "path";
import fs from "fs";
import { createCanvas, loadImage, registerFont } from "canvas";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const createTraining = async (user, request, file) => {
  const training = validate(createTrainingValidation, request);

  // Ensure the instructorId matches the logged-in user's ID
  if (training.instructorId !== user.id) {
    throw new ResponseError(
      404,
      "You can only create training with your own instructor ID"
    );
  }

  // If file exists, add image path to training data
  const trainingData = {
    ...training,
  };

  if (file) {
    trainingData.image = "/trainings/" + path.basename(file.path);
  }

  return prismaClient.training.create({
    data: trainingData,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      instructorId: true,
      createdAt: true,
      updatedAt: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const createTrainingUser = async (user, request) => {
  const trainingUser = validate(createTrainingUserValidation, request);

  // Verify if training and user exist
  const training = await prismaClient.training.findUnique({
    where: { id: trainingUser.trainingId },
    include: {
      meetings: {
        include: {
          modules: true,
          quizzes: true,
          tasks: true,
        },
      },
    },
  });

  if (!training) {
    throw new ResponseError(404, "Training not Found");
  }

  const existingUser = await prismaClient.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    throw new ResponseError(404, "User not Found");
  }

  const existingEnrollment = await prismaClient.training_Users.findFirst({
    where: {
      trainingId: trainingUser.trainingId,
      userId: user.id,
    },
  });

  if (existingEnrollment) {
    throw new ResponseError(400, "User already enrolled in this training");
  }

  // Create the enrollment record first to get the training_user ID
  const enrolledUser = await prismaClient.training_Users.create({
    data: {
      trainingId: trainingUser.trainingId,
      userId: user.id, // This was missing!
      status: trainingUser.status,
    },
  });

  // For each meeting in the training, create related submissions and scores
  for (const meeting of training.meetings) {
    // Create module submissions for this meeting
    for (const module of meeting.modules) {
      await prismaClient.moduleSubmission.create({
        data: {
          moduleId: module.id,
          trainingUserId: enrolledUser.id,
          score: 0,
        },
      });
    }

    // Create quiz submissions for this meeting
    for (const quiz of meeting.quizzes) {
      await prismaClient.quizSubmission.create({
        data: {
          quizId: quiz.id,
          trainingUserId: enrolledUser.id,
          score: 0,
          answers: {}, // Empty JSON object for answers
        },
      });
    }

    // Create task submissions for this meeting
    for (const task of meeting.tasks) {
      await prismaClient.taskSubmission.create({
        data: {
          taskId: task.id,
          trainingUserId: enrolledUser.id,
          score: 0,
        },
      });
    }

    // Create a score record for this meeting
    await prismaClient.score.create({
      data: {
        meetingId: meeting.id,
        trainingUserId: enrolledUser.id,
        moduleScore: 0,
        quizScore: 0,
        taskScore: 0,
        totalScore: 0,
      },
    });
  }

  // Return the created training user with additional information
  return prismaClient.training_Users.findUnique({
    where: { id: enrolledUser.id },
    select: {
      id: true,
      trainingId: true,
      userId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      training: {
        select: {
          title: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      moduleSubmissions: true,
      quizSubmissions: true,
      taskSubmissions: true,
    },
  });
};

const getStudentTrainings = async (user, request) => {
  const option = validate(getStudentTrainingsValidation, request);

  // calculate pagination
  const skip = (option.page - 1) * option.size;

  const where = {
    userId: user.id,
  };

  if (option.status) {
    where.status = option.status;
  }

  // Get Total count of pagination
  const total = await prismaClient.training_Users.count({ where });

  // Get Trainings
  const trainings = await prismaClient.training_Users.findMany({
    where,
    skip,
    take: option.size,
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      training: {
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          // Include meetings to calculate progress
          meetings: {
            select: {
              id: true,
              title: true,
              modules: {
                select: {
                  id: true,
                },
              },
              quizzes: {
                select: {
                  id: true,
                },
              },
              tasks: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      // Include scores for progress calculation
      scores: true,
      // Include submissions for progress calculation
      moduleSubmissions: {
        select: {
          id: true,
          moduleId: true,
          answer: true,
        },
      },
      quizSubmissions: {
        select: {
          id: true,
          quizId: true,
          score: true,
        },
      },
      taskSubmissions: {
        select: {
          id: true,
          taskId: true,
          answer: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate progress for each training
  const trainingsWithProgress = await Promise.all(
    trainings.map(async (training) => {
      // Calculate progress for each meeting
      const meetingsProgress = training.training.meetings.map((meeting) => {
        // Find the user's score for this meeting
        const userScore = training.scores.find(
          (score) => score.meetingId === meeting.id
        );

        // Calculate module progress - check if module submissions exist
        const totalModules = meeting.modules.length;
        const completedModules = meeting.modules.filter((moduleItem) =>
          training.moduleSubmissions.some(
            (submission) =>
              submission.moduleId === moduleItem.id &&
              submission.answer !== null &&
              submission.answer !== ""
          )
        ).length;

        // Calculate quiz progress - check if quiz submissions with scores exist
        const totalQuizzes = meeting.quizzes.length;
        const completedQuizzes = meeting.quizzes.filter((quizItem) =>
          training.quizSubmissions.some(
            (submission) =>
              submission.quizId === quizItem.id && submission.score > 0
          )
        ).length;

        // Calculate task progress - check if task submissions exist
        const totalTasks = meeting.tasks.length;
        const completedTasks = meeting.tasks.filter((taskItem) =>
          training.taskSubmissions.some(
            (submission) =>
              submission.taskId === taskItem.id &&
              submission.answer !== null &&
              submission.answer !== ""
          )
        ).length;

        // Calculate total progress
        const totalItems = totalModules + totalQuizzes + totalTasks;
        const completedItems =
          completedModules + completedQuizzes + completedTasks;

        const progressPercentage =
          totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return {
          meetingId: meeting.id,
          title: meeting.title,
          progress: progressPercentage,
        };
      });

      // Calculate overall training progress
      const overallProgress =
        meetingsProgress.length > 0
          ? Math.round(
              meetingsProgress.reduce(
                (sum, meeting) => sum + meeting.progress,
                0
              ) / meetingsProgress.length
            )
          : 0;

      // Remove unnecessary fields before returning
      delete training.scores;
      delete training.moduleSubmissions;
      delete training.quizSubmissions;
      delete training.taskSubmissions;
      delete training.training.meetings;

      return {
        ...training,
        progress: overallProgress,
        meetingsProgress,
      };
    })
  );

  return {
    data: trainingsWithProgress,
    paging: {
      page: option.page,
      total_items: total,
      total_pages: Math.ceil(total / option.size),
    },
  };
};

const getInstructorTrainings = async (user, request) => {
  const option = validate(getInstructorTrainingsValidation, request);

  const skip = (option.page - 1) * option.size;

  const where = {
    instructorId: user.id,
  };

  if (option.status) {
    where.status = option.status;
  }

  const total = await prismaClient.training.count({ where });

  const trainings = await prismaClient.training.findMany({
    where,
    skip,
    take: option.size,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          meetings: true,
          users: true,
        },
      },
    },
  });
  return {
    data: {
      training: trainings,
    },
    paging: {
      page: option.page,
      total_items: total,
      total_pages: Math.ceil(total / option.size),
    },
  };
};

const getTrainingDetail = async (user, trainingId) => {
  trainingId = validate(getTrainingDetailValidation, { trainingId }).trainingId;

  // Check if user has access to this training
  const trainingUser = await prismaClient.training_Users.findFirst({
    where: {
      trainingId: trainingId,
      userId: user.id,
    },
  });

  if (!trainingUser) {
    throw new ResponseError(403, "You don't have access to this training");
  }

  // Get training details with meetings
  const training = await prismaClient.training.findUnique({
    where: { id: trainingId },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meetings: {
        select: {
          id: true,
          title: true,
          meetingDate: true,
          createdAt: true,
          updatedAt: true,
          modules: {
            select: {
              id: true,
              title: true,
              // Get user submissions for this module
              submissions: {
                where: {
                  trainingUserId: trainingUser.id,
                },
                select: {
                  id: true,
                  answer: true,
                  score: true,
                },
              },
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              // Get user submissions for this quiz
              submissions: {
                where: {
                  trainingUserId: trainingUser.id,
                },
                select: {
                  id: true,
                  answers: true,
                  score: true,
                },
              },
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              // Get user submissions for this task
              submissions: {
                where: {
                  trainingUserId: trainingUser.id,
                },
                select: {
                  id: true,
                  answer: true,
                  score: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          meetings: true,
          users: true,
        },
      },
    },
  });

  if (!training) {
    throw new ResponseError(404, "Training not found");
  }

  // Add logic to determine if a meeting should be locked based on previous meeting completion
  const meetingsWithLockStatus = [];
  let previousMeetingCompleted = true; // First meeting is always unlocked

  for (let i = 0; i < training.meetings.length; i++) {
    const meeting = training.meetings[i];
    
    // Determine if this meeting should be locked
    const isLocked = i > 0 && !previousMeetingCompleted;
    
    // Calculate completion status for current meeting based on specific criteria
    const allModulesCompleted = meeting.modules.every(module => 
      module.submissions.length > 0 && module.submissions[0]?.answer !== null
    );
    
    const allQuizzesCompleted = meeting.quizzes.every(quiz => 
      quiz.submissions.length > 0 && (quiz.submissions[0]?.score >= 80)
    );
    
    const allTasksCompleted = meeting.tasks.every(task => 
      task.submissions.length > 0 && task.submissions[0]?.answer !== null
    );
    
    // Current meeting is considered complete if all modules, quizzes, and tasks meet the criteria
    const isMeetingCompleted = allModulesCompleted && allQuizzesCompleted && allTasksCompleted;
    
    // Store the completion status for the next iteration
    previousMeetingCompleted = isMeetingCompleted;

    // Transform meeting data with lock status
    meetingsWithLockStatus.push({
      ...meeting,
      isLocked: isLocked,
      isCompleted: isMeetingCompleted,
      modules: meeting.modules.map((module) => ({
        id: module.id,
        title: module.title,
        moduleAnswer: module.submissions[0]?.answer || null,
        moduleScore: module.submissions[0]?.score || 0,
        submissionId: module.submissions[0]?.id || null,
      })),
      quizzes: meeting.quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        quizScore: quiz.submissions[0]?.score || 0,
        submissionId: quiz.submissions[0]?.id || null,
      })),
      tasks: meeting.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        taskAnswer: task.submissions[0]?.answer || null,
        taskScore: task.submissions[0]?.score || 0,
        submissionId: task.submissions[0]?.id || null,
      })),
    });
  }

  // Create the transformed training object with the updated meetings
  const transformedTraining = {
    ...training,
    meetings: meetingsWithLockStatus,
  };

  return {
    data: transformedTraining,
  };
};

const getInstructorTrainingDetail = async (user, trainingId) => {
  trainingId = validate(getTrainingDetailValidation, { trainingId }).trainingId;

  // Get training details with meetings
  const training = await prismaClient.training.findUnique({
    where: { id: trainingId, instructorId: user.id },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      updatedAt: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meetings: {
        select: {
          id: true,
          title: true,
          meetingDate: true,
          createdAt: true,
          updatedAt: true,
          modules: {
            select: {
              id: true,
              title: true,
              content: true,
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              questions: true,
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              taskQuestion: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc", // sorted by their creation timestamp in ascending
        },
      },
      _count: {
        select: {
          meetings: true,
          users: true,
        },
      },
    },
  });

  if (!training) {
    throw new ResponseError(
      404,
      "Training not found or you dont have access to this training"
    );
  }

  return {
    data: training,
  };
};

const updateTraining = async (user, trainingId, request, file) => {
  const training = validate(updateTrainingValidation, request);

  if (training.instructorId !== user.id) {
    throw new ResponseError(
      404,
      "You can only update training with your own instructor ID"
    );
  }

  // Cek keberadaan training dengan ID dari parameter
  const existingTraining = await prismaClient.training.findUnique({
    where: {
      id: trainingId,
    },
  });

  if (!existingTraining || existingTraining.instructorId !== user.id) {
    throw new ResponseError(405, "Training is not found");
  }

  const trainingData = {
    ...training,
  };

  // Jika ada file baru dan training lama memiliki gambar, hapus gambar lama
  if (file && existingTraining.image) {
    try {
      // Gunakan process.cwd() sebagai pengganti __dirname
      const oldImagePath = path.join(
        process.cwd(),
        "public",
        existingTraining.image
      );

      // Cek apakah file ada sebelum dihapus
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log(`Successfully deleted old image: ${oldImagePath}`);
      }
    } catch (err) {
      console.error("Error deleting old image:", err);
      // Lanjutkan proses meskipun gagal menghapus (non-critical error)
    }
  }

  if (file) {
    trainingData.image = "/trainings/" + path.basename(file.path);
  }

  return prismaClient.training.update({
    where: {
      id: trainingId,
    },
    data: trainingData,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      instructorId: true,
      createdAt: true,
      updatedAt: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const removeTraining = async (user, trainingId) => {
  trainingId = validate(getTrainingDetailValidation, {
    trainingId,
  }).trainingId;

  const totalTraininginDatabase = await prismaClient.training.count({
    where: {
      id: trainingId,
      instructorId: user.id,
    },
  });

  if (totalTraininginDatabase !== 1) {
    throw new ResponseError(
      404,
      "Training is not found or you are not the instructor of this course"
    );
  }

  // Start a transaction to ensure atomic deletion
  return prismaClient.$transaction(async (tx) => {
    // First, delete deeply nested submissions
    await tx.moduleSubmission.deleteMany({
      where: { trainingUser: { trainingId } },
    });

    await tx.quizSubmission.deleteMany({
      where: { trainingUser: { trainingId } },
    });

    await tx.taskSubmission.deleteMany({
      where: { trainingUser: { trainingId } },
    });

    // Delete scores
    await tx.score.deleteMany({
      where: { trainingUser: { trainingId } },
    });

    // Delete related meetings and their contents
    const meetings = await tx.meeting.findMany({
      where: { trainingId },
      select: { id: true },
    });

    const meetingIds = meetings.map((meeting) => meeting.id);

    // Delete meeting-related content
    await tx.module.deleteMany({
      where: { meetingId: { in: meetingIds } },
    });

    await tx.quiz.deleteMany({
      where: { meetingId: { in: meetingIds } },
    });

    await tx.task.deleteMany({
      where: { meetingId: { in: meetingIds } },
    });

    // Delete meetings
    await tx.meeting.deleteMany({
      where: { trainingId },
    });

    // Delete training users
    await tx.training_Users.deleteMany({
      where: { trainingId },
    });

    // Finally, delete the training
    return tx.training.delete({
      where: {
        id: trainingId,
        instructorId: user.id,
      },
    });
  });
};

/**
 * Check and update training completion status, generate certificate if needed
 * @param {string} trainingUserId - Training User ID
 * @param {object} tx - Prisma transaction object (optional)
 * @returns {Promise<boolean>} - Whether the training was completed
 */
const checkAndUpdateTrainingCompletion = async (trainingUserId, tx = prismaClient) => {
  console.log(`Checking completion for training user: ${trainingUserId}`);
  
  // Get training user with related data
  const trainingUser = await tx.training_Users.findUnique({
    where: { id: trainingUserId },
    include: {
      training: {
        include: {
          meetings: {
            include: {
              modules: true,
              quizzes: true,
              tasks: true
            }
          }
        }
      },
      user: true, // Include user data to get the name
      moduleSubmissions: {
        where: {
          answer: {
            not: null
          }
        }
      },
      quizSubmissions: {
        where: {
          score: {
            gte: 0 // Score bisa 0, yang penting tidak null
          }
        }
      },
      taskSubmissions: {
        where: {
          answer: {
            not: null
          }
        }
      },
      scores: true // Include scores to calculate final score
    }
  });

  if (!trainingUser) {
    console.log(`Training user ${trainingUserId} not found`);
    return false;
  }

  console.log(`Found training user: ${trainingUser.id} for training: ${trainingUser.trainingId}`);

  // Get all module, quiz, and task IDs from all meetings
  const allModuleIds = [];
  const allQuizIds = [];
  const allTaskIds = [];

  trainingUser.training.meetings.forEach(meeting => {
    meeting.modules.forEach(module => allModuleIds.push(module.id));
    meeting.quizzes.forEach(quiz => allQuizIds.push(quiz.id));
    meeting.tasks.forEach(task => allTaskIds.push(task.id));
  });

  console.log(`Total requirements - Modules: ${allModuleIds.length}, Quizzes: ${allQuizIds.length}, Tasks: ${allTaskIds.length}`);

  // Get submitted module, quiz, and task IDs (with actual answers/scores)
  const submittedModuleIds = trainingUser.moduleSubmissions.map(sub => sub.moduleId);
  const submittedQuizIds = trainingUser.quizSubmissions.map(sub => sub.quizId);
  const submittedTaskIds = trainingUser.taskSubmissions.map(sub => sub.taskId);

  console.log(`Completed - Modules: ${submittedModuleIds.length}, Quizzes: ${submittedQuizIds.length}, Tasks: ${submittedTaskIds.length}`);

  // Check if all required submissions are complete
  const allModulesCompleted = allModuleIds.every(id => submittedModuleIds.includes(id));
  const allQuizzesCompleted = allQuizIds.every(id => submittedQuizIds.includes(id));
  const allTasksCompleted = allTaskIds.every(id => submittedTaskIds.includes(id));

  const allSubmissionsComplete = allModulesCompleted && allQuizzesCompleted && allTasksCompleted;
  console.log(`All submissions complete: ${allSubmissionsComplete}`);

  // Update status if all submissions are complete
  if (allSubmissionsComplete && trainingUser.status === 'enrolled') {
    console.log(`Updating status to completed for training user ${trainingUserId}`);
    
    await tx.training_Users.update({
      where: { id: trainingUserId },
      data: { 
        status: 'completed',
        updatedAt: new Date()
      }
    });
    
    // Calculate final score from all scores
    const finalScore = calculateFinalScore(trainingUser.scores);
    console.log(`Final score calculated: ${finalScore}`);
    
    // Check if the final score meets the minimum required for certification
    const minimumScore =  5;
    console.log(`Minimum score required: ${minimumScore}`);
    
    if (finalScore >= minimumScore) {
      console.log(`Score meets requirements. Generating certificate...`);
      try {
        // Generate certificate
        const certificate = await generateAndSaveCertificate(
          trainingUser.user.id,
          trainingUser.training.id,
          trainingUser.user.name,
          trainingUser.training.title,
          finalScore,
          tx
        );
        console.log(`Certificate generated successfully: ${certificate.id}`);
      } catch (error) {
        console.error('Failed to generate certificate:', error);
      }
    } else {
      console.log(`Score does not meet minimum requirements for certification`);
    }
    
    return true;
  }

  return false;
};

/**
 * Calculate the final score from all the scores
 * @param {Array} scores - Array of score objects
 * @returns {number} - The final score
 */
const calculateFinalScore = (scores) => {
  if (!scores || scores.length === 0) return 0;
  
  // Calculate average of totalScores
  const totalScoreSum = scores.reduce((sum, score) => sum + score.totalScore, 0);
  return Math.round(totalScoreSum / scores.length);
};

/**
 * Generate certificate image and save to database
 * @param {string} userId - User ID
 * @param {string} trainingId - Training ID
 * @param {string} userName - User's full name
 * @param {string} trainingTitle - Training title
 * @param {number} finalScore - Final score achieved
 * @param {object} tx - Prisma transaction object
 * @returns {Promise<object>} - The created certificate
 */
const generateAndSaveCertificate = async (userId, trainingId, userName, trainingTitle, finalScore, tx) => {
  try {
    console.log(`Generating certificate for user ${userId} in training ${trainingId}`);
    
    // Check if certificate already exists
    const existingCertificate = await tx.certificate.findUnique({
      where: {
        trainingId_userId: {
          trainingId,
          userId
        }
      }
    });

    if (existingCertificate) {
      console.log(`Certificate already exists: ${existingCertificate.id}`);
      return existingCertificate;
    }
    
    // Generate a unique certificate number
    const certificateNumber = generateCertificateNumber();
    console.log(`Generated certificate number: ${certificateNumber}`);
    
    // Generate the certificate image
    const certificatePath = await createCertificateImage(userName, trainingTitle, certificateNumber);
    console.log(`Certificate image created at: ${certificatePath}`);
    
    // Save certificate to database
    const certificate = await tx.certificate.create({
      data: {
        certificateNumber,
        trainingId,
        userId,
        issuedDate: new Date(),
        expiryDate: getExpiryDate(),
        finalScore,
        status: 'active',
        filePath: certificatePath,
        metadata: {
          generatedAt: new Date().toISOString(),
          template: 'standard'
        }
      }
    });
    
    console.log(`Certificate saved to database with ID: ${certificate.id}`);
    return certificate;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

/**
 * Generate a unique certificate number
 * @returns {string} - Certificate number
 */
const generateCertificateNumber = () => {
  const prefix = 'KG/CERT';
  const date = moment().format('YYYY/MM/DD');
  const random = Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0');
  return `${prefix}/${date}/${random}`;
};

/**
 * Get expiry date (1 year from now)
 * @returns {Date} - Expiry date
 */
const getExpiryDate = () => {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  return expiryDate;
};

/**
 * Create certificate image from template
 * @param {string} userName - User's full name
 * @param {string} trainingTitle - Training title
 * @param {string} certificateNumber - Certificate number
 * @returns {Promise<string>} - Path to saved certificate image
 */
const createCertificateImage = async (userName, trainingTitle, certificateNumber) => {
  try {
    console.log('Creating certificate image...');
    
    // Register the Poppins font
    try {
      // Resolve font path using runtime path resolution
      const fontPath = path.resolve(process.cwd(), 'fonts', 'Poppins-Regular.ttf');
      console.log(`Looking for font at: ${fontPath}`);
      
      if (fs.existsSync(fontPath)) {
        console.log('Font file exists, registering...');
        registerFont(fontPath, { family: 'Poppins' });
      } else {
        console.log('Font file not found, using fallback fonts');
        // We'll use a fallback font in the font settings
      }
    } catch (fontError) {
      console.error('Error registering font:', fontError);
      // Continue with default fonts
    }
    
    // Try multiple locations for the template file
    let template;
    const possibleTemplatePaths = [
      path.resolve(process.cwd(), 'public', 'certif.jpeg'),
      path.resolve(process.cwd(), 'src', 'public', 'certif.jpeg'),
      path.resolve(process.cwd(), '..', 'public', 'certif.jpeg')
    ];
    
    console.log('Trying to locate certificate template...');
    for (const templatePath of possibleTemplatePaths) {
      console.log(`Checking path: ${templatePath}`);
      if (fs.existsSync(templatePath)) {
        console.log(`Template found at: ${templatePath}`);
        template = await loadImage(templatePath);
        break;
      }
    }
    
    if (!template) {
      throw new Error('Certificate template not found in any of the expected locations');
    }
    
    // Create canvas with template dimensions
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');
    
    // Draw template image
    ctx.drawImage(template, 0, 0, template.width, template.height);
    
    // Set font styles
    const fontFamily = 'Poppins, Arial, sans-serif';
    
    // Draw certificate ID
    ctx.font = `bold 16px ${fontFamily}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(certificateNumber, template.width / 2, 240);
    
    // Draw participant name
    ctx.font = `bold 24px ${fontFamily}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(userName, template.width / 2, 380);
    
    // Draw training title
    ctx.font = `18px ${fontFamily}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(trainingTitle, template.width / 2, 520);
    
    // Draw current date
    const currentDate = moment().format('DD MMMM YYYY');
    ctx.font = `16px ${fontFamily}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(`Jakarta, ${currentDate}`, template.width / 2, 640);
    
    // Create directory if it doesn't exist
    const certificatesDir = path.resolve(process.cwd(), 'public', 'certificates');
    console.log(`Creating certificates directory if needed: ${certificatesDir}`);
    
    if (!fs.existsSync(certificatesDir)) {
      console.log('Directory does not exist, creating...');
      fs.mkdirSync(certificatesDir, { recursive: true });
    }
    
    // Save the certificate as PNG
    const fileName = `certificate-${certificateNumber.replace(/\//g, '-')}.png`;
    const outputPath = path.join(certificatesDir, fileName);
    console.log(`Saving certificate to: ${outputPath}`);
    
    // Use a promise to handle file saving
    return new Promise((resolve, reject) => {
      const outStream = fs.createWriteStream(outputPath);
      const pngStream = canvas.createPNGStream();
      
      outStream.on('finish', () => {
        console.log('Certificate file written successfully');
        resolve(`/certificates/${fileName}`);
      });
      
      outStream.on('error', (err) => {
        console.error('Error writing certificate file:', err);
        reject(err);
      });
      
      pngStream.pipe(outStream);
    });
    
  } catch (error) {
    console.error('Error creating certificate image:', error);
    throw error;
  }
};

export default {
  createTraining,
  createTrainingUser,
  getStudentTrainings,
  getInstructorTrainings,
  getTrainingDetail,
  getInstructorTrainingDetail,
  updateTraining,
  removeTraining,
  checkAndUpdateTrainingCompletion
};
