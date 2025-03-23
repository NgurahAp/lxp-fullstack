// GET ALL TRAINING
export interface Instructor {
  id: number;
  name: string;
  email: string;
}

export interface Training {
  id: number;
  title: string;
  description: string;
  image: string;
  updateAt: Date;
  instructor: Instructor;
}

export interface TrainingData {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  training: Training;
}

export interface TrainingResponse {
  data: TrainingData[];
}

// GET DETAIL TRAINING

export interface Module {
  id: number;
  title: string;
  moduleAnswer: string;
}

export interface Quiz {
  id: number;
  title: string;
  quizScore: number;
}

export interface Task {
  id: number;
  title: string;
  taskAnswer: string;
}

export interface Meeting {
  id: number;
  title: string;
  meetingDate: string | null;
  createdAt: string;
  updatedAt: string;
  modules: Module[];
  quizzes: Quiz[];
  tasks: Task[];
}

interface Count {
  meetings: number;
  users: number;
}

export interface DetailTrainingData {
  id: number;
  title: string;
  description: string;
  image: string;
  instructor: Instructor;
  updatedAt: Date;
  meetings: Meeting[];
  _count: Count;
}

export interface DetailTrainingResponse {
  data: DetailTrainingData;
}

//  Instructor

export interface InstructorTraining {
  id: string;
  title: string;
  description: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    meetings: number;
    users: number;
  };
}

interface Data {
  training: InstructorTraining[];
}

interface Paging {
  page: number;
  total_items: number;
  total_pages: number;
}

export interface GetTrainingInstructorResponse {
  data: Data;
  paging: Paging;
}

export interface CreateTrainingResponse {
  data: Training;
}
