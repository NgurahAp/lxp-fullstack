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

export interface Module {
  id: number;
  title: string;
  content: string;
  moduleScore: number;
  moduleAnswer: string | null;
  createdAt: string;
  updatedAt: string;
  meeting: Meeting;
}

export interface ModuleResponse {
  data: Module;
}
