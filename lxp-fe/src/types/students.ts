export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  completedCourses: number;
  pendingAssignments: number;
  status: "enrolled" | "completed" 
  lastActive: Date
}

export interface Paging {
  page: number;
  total_items: number;
  total_pages: number;
}

export interface StudentsResponse {
  data: {
    students: Student[];
  };
  paging: Paging;
}
