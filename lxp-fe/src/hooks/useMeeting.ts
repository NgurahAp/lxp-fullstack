import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createMeeting } from "../service/meetingService";

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
