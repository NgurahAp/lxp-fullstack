type Student = {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  createdAt: string;
  totalStudents: number;
  recentStudents: Student[];
};

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
};

type Summary = {
  totalCourses: number;
  totalUniqueStudents: number;
};

export type InstructorDashboardData = {
  profile: Profile;
  summary: Summary;
  courses: Course[];
};

export type InstructorDashboardResponse = {
  data: InstructorDashboardData;
};
