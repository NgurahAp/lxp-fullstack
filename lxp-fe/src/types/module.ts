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

export interface ModuleData {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  meeting: Meeting;
  submission: Submission;
}

export interface ModuleResponse {
  data: ModuleData;
}

export interface SubmitModuleResponse {
  data: ModuleData;
}

export interface CreateModuleParams {
  meetingId: string;
  payload: FormData;
}

export interface UpdateModuleParams {
  trainingId: string;
  meetingId: string;
  moduleId: string;
  payload: FormData;
}

export interface DeleteModuleParams {
  trainingId: string;
  meetingId: string;
  moduleId: string;
}
