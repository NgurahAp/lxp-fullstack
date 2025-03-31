export interface MeetingData {
  id: string;
  title: string;
  meetingDate?: Date;
  trainingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMeetingResponse {
  data: MeetingData;
}
