import { prismaClient } from "../application/database.js";

const getStudentDashboard = async (user, request) => {
  const profile = await prismaClient.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profile: true,
      trainingUsers: {
        select: {
          training: {
            select: {
              id: true,
              title: true,
              description: true,
              image: true,
              instructor: true,
              meetings: {
                select: {
                  id: true,
                  scores: {
                    select: {
                      totalScore: true,
                    },
                  },
                },
              },
            },
          },
          id: true,
          status: true,
        },
      },
      _count: {
        select: {
          trainingUsers: true,
        },
      },
    },
  });

  if (!profile) {
    throw new ResponseError(404, "User not found");
  }

  // Transform data dan hitung average score untuk setiap training
  const trainingsWithScores = profile.trainingUsers.map((tu) => {
    let totalScore = 0;
    let meetingsWithScore = 0;

    tu.training.meetings.forEach((meeting) => {
      if (meeting.scores.length > 0) {
        totalScore += meeting.scores[0].totalScore;
        meetingsWithScore++;
      }
    });

    const averageScore =
      meetingsWithScore > 0 ? Math.round(totalScore / meetingsWithScore) : 0;

    return {
      id: tu.training.id,
      title: tu.training.title,
      description: tu.training.description,
      image: tu.training.image,
      status: tu.status,
      instructor: tu.training.instructor.name,
      averageScore: averageScore,
    };
  });

  // Hitung overall average score dari semua training
  const totalUserScore = trainingsWithScores.reduce(
    (sum, training) => sum + training.averageScore,
    0
  );
  const overallAverageScore =
    trainingsWithScores.length > 0
      ? Math.round(totalUserScore / trainingsWithScores.length)
      : 0;

  return {
    data: {
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatar: profile.profile,
      },
      trainings: trainingsWithScores,
      totalTrainings: profile._count.trainingUsers,
      overallAverageScore: overallAverageScore,
    },
  };
};

const getInstructorDashboard = async (user) => {
  // Memastikan user adalah instructor
  if (user.role !== "instructor") {
    throw new ResponseError(403, "Access forbidden. Instructor role required");
  }

  const instructorData = await prismaClient.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profile: true,
      trainings: {
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              users: true, // Jumlah murid per course
            },
          },
          users: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              status: true,
            },
            take: 5, // Batasi tampilan murid yang ditampilkan di dashboard
          },
        },
      },
      _count: {
        select: {
          trainings: true, // Total course
        },
      },
    },
  });

  if (!instructorData) {
    throw new ResponseError(404, "Instructor not found");
  }

  // Hitung total murid yang unik dari semua kursus
  const allStudentIds = new Set();

  instructorData.trainings.forEach((training) => {
    training.users.forEach((user) => {
      allStudentIds.add(user.user.id);
    });
  });

  // Transformasi data course untuk response
  const formattedCourses = instructorData.trainings.map((training) => {
    return {
      id: training.id,
      title: training.title,
      description: training.description,
      image: training.image,
      createdAt: training.createdAt,
      totalStudents: training._count.users,
      recentStudents: training.users.map((user) => ({
        id: user.id,
        userId: user.user.id,
        name: user.user.name,
        email: user.user.email,
        status: user.status,
      })),
    };
  });

  return {
    data: {
      profile: {
        id: instructorData.id,
        email: instructorData.email,
        name: instructorData.name,
        role: instructorData.role,
        avatar: instructorData.profile,
      },
      summary: {
        totalCourses: instructorData._count.trainings,
        totalUniqueStudents: allStudentIds.size,
      },
      courses: formattedCourses,
    },
  };
};


export default { getStudentDashboard, getInstructorDashboard };
