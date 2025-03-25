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

interface Submission {
  answer: string;
  score: number;
}

export interface SubmitTaskRequest {
  taskId: string | undefined;
  file: File | null;
}

export interface TaskData {
  id: number;
  title: string;
  taskQuestion: string;
  createdAt: string;
  updatedAt: string;
  meeting: Meeting;
  submission: Submission;
}

export interface TaskResponse {
  data: TaskData;
}
