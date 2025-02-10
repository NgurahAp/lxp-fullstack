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
