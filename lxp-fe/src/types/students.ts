export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  completedCourses: number;
  pendingAssignments: number;
  status: "enrolled" | "completed";
  lastActive: Date;
}

export interface Paging {
  page: number;
  total_items: number;
  total_pages: number;
}

export interface Profile {
  studentId: string;
  name: string;
  email: string;
  enrolledCourses: number;
  completedCourses: number;
  pendingAssignments: number;
  status: string;
  lastActive: string; // ISO date string
}

export interface Module {
  id: string;
  answer: string | null;
  score: number;
  updatedAt: string; // ISO date string
  moduleTitle: string;
  meetingTitle: string;
  trainingTitle: string;
}

export interface Quiz {
  id: string;
  score: number;
  updatedAt: string; // ISO date string
  quizTitle: string;
  meetingTitle: string;
  trainingTitle: string;
}

export interface Task {
  id: string;
  answer: string | null;
  score: number;
  updatedAt: string; // ISO date string
  taskTitle: string;
  taskQuestion: string;
  meetingTitle: string;
  trainingTitle: string;
}

export interface StudentsResponse {
  data: {
    students: Student[];
  };
  paging: Paging;
}

export interface DetailStudentResponse {
  data: {
    profile: Profile;
    modules: Module[];
    quizzes: Quiz[];
    tasks: Task[];
  };
}
