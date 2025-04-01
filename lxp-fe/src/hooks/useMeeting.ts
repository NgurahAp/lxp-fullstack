import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createMeeting, updateMeeting } from "../service/meetingService";
import { CreateMeetingResponse, UpdateMeetingParams } from "../types/meeting";

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (training: { trainingId: string; title: string }) =>
      createMeeting(training),

    onSuccess: () => {
      // Invalidate related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["detailTraining"],
      });

      // Show success notification
      toast.success("Pelatihan berhasil dibuat");
    },

    onError: (error: Error) => {
      console.log(error.message);
      toast.error("Gagal membuat pelatihan");
    },
  });
};

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateMeetingResponse, Error, UpdateMeetingParams>({
    mutationFn: (params) => updateMeeting(params),

    onSuccess: () => {
      // Invalidate related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["detailTraining"],
      });

      // Show success notification
      toast.success("Meeting berhasil diedit");
    },

    onError: (error: Error) => {
      console.log(error.message);
      toast.error("Gagal mengedit Meeting");
    },
  });
};
