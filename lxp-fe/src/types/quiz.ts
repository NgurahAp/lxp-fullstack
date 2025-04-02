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

export interface Question {
  options: string[];
  question: string;
  correctAnswer: number;
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

export interface DetailQuizInstructorData {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  meeting: Meeting;
}

export interface DetailQuizInstructorResponse {
  data: DetailQuizInstructorData;
}

export interface QuizForm {
  title: string;
  questions: Question[];
}

export interface CreateQuizParams {
  meetingId: string | undefined;
  formData: QuizForm
}

export interface UpdateQuizParams {
  trainingId: string | undefined;
  meetingId: string | undefined;
  quizId: string | undefined;
  formData: QuizForm;
}

export interface DeleteQuizParams {
  trainingId: string | undefined;
  meetingId: string | undefined;
  quizId: string | undefined;
}
