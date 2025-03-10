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

export default { getStudentDashboard };
