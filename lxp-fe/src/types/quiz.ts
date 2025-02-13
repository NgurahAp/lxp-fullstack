interface Training {
  id: number;
  title: string;
  description: string;
}

interface Meeting {
  id: number;
  title: string;
  meetingDate: string | null;
  training: Training;
}

export interface Quiz {
  id: number;
  title: string;
  quizScore: number;
  createdAt: string;
  updatedAt: string;
  meeting: Meeting;
}

export interface GetQuizResponse {
  data: Quiz;
}
