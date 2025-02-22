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

interface Question {
  question: string;
  options: string[];
}

export interface Quiz {
  id: number;
  title: string;
  quizScore: number;
  createdAt: string;
  updatedAt: string;
  meeting: Meeting;
}

export interface QuizQuestion {
  id: number;
  title: string;
  questions: Question[];
  meeting: Meeting;
}

export interface GetQuizResponse {
  data: Quiz;
}
