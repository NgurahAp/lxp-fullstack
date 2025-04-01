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

export interface UpdateMeetingParams {
  trainingId: string | undefined;
  meetingId: string | undefined;
  title: string;
}

export interface DeleteMeetingParams {
  trainingId: string | undefined;
  meetingId: string | undefined;
}
