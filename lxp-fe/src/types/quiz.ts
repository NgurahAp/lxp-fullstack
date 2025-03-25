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

interface Submission {
  score: number;
}

export interface QuizData {
  id: number;
  title: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  meeting: Meeting;
  submission: Submission;
}

interface QuizSubmissionAnswer {
  questionIndex: number;
  selectedAnswer?: number;
}

export interface QuizSubmissionPayload {
  answers: QuizSubmissionAnswer[];
  trainingUserId: string | undefined;
}

export interface QuizSubmissionParams {
  quizId: string;
  answers: QuizSubmissionAnswer[];
  trainingUserId: string | undefined;
}

export interface QuizQuestion {
  id: number;
  title: string;
  trainingUserId: string;
  questions: Question[];
  meeting: Meeting;
}

export interface QuizResponse {
  data: QuizData;
}
