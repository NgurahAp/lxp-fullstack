type Score = {
  moduleScore: number;
  quizScore: number;
  taskScore: number;
  totalScore: number;
};

type Meeting = {
  id: number;
  title: string;
  meetingDate: string | null;
  scores: Score[];
};

export type ScoreData = {
  id: number;
  title: string;
  description: string;
  meetings: Meeting[];
  totalTrainingScore: number;
};

export type ScoreResponse = {
  data: ScoreData;
};
