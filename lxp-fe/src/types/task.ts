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

export interface SubmitTaskRequest {
  taskId: string | undefined;
  file: File | null;
}

export interface TaskData {
  id: number;
  title: string;
  taskQuestion: string;
  taskAnswer: string | null;
  taskScore: number;
  createdAt: string;
  updatedAt: string;
  meeting: Meeting;
}

export interface TaskResponse {
  data: TaskData;
}
