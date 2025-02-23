import { useParams } from "react-router-dom";
import { useGetTask } from "../../hooks/useTask";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { Breadcrumb } from "../../Components/BreadCrumbs";
import PageInfo from "../../Components/PageInfo";
import { FinishedAssignment } from "./components/FinishedAssignment";
import { BackLink } from "../../Components/BackLink";
import { FileUploadForm } from "./components/FileUploadForm";

export const Task = () => {
  const { meetingId, taskId } = useParams<{
    meetingId: string;
    taskId: string;
  }>();

  const { data, isLoading, error } = useGetTask(meetingId, taskId);

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (error) {
    return (
      <div className="min-h-[85vh] w-screen flex items-center justify-center">
        Error loading data
      </div>
    );
  }

  const breadcrumbItems = [
    {
      label: "Beranda",
      path: "/dashboard",
    },
    {
      label: "Pelatihan-ku",
      path: "/pelatihanku",
    },
    {
      label: data?.meeting.title,
      path: `/pelatihanku/${data?.meeting.training.id}`,
    },
    {
      label: data?.title,
    },
  ];

  return (
    <div className="min-h-[85vh] w-screen flex flex-col md:pt-36 pt-24 md:px-24 px-4 bg-gray-100">
      <Breadcrumb items={breadcrumbItems} />
      <PageInfo title={data?.title} />
      <div className="bg-white mt-5 w-full p-8 h-full rounded-lg">
        <h1 className="md:text-2xl text-base font-bold pb-3">Pertanyaan</h1>

        <p className="whitespace-pre-line md:text-base text-sm">
          {data?.taskQuestion}
        </p>
        <div className="border-b-[1px] border-gray-400 md:my-8 my-3" />
        {data?.taskAnswer != null ? (
          <FinishedAssignment assignmentData={data} />
        ) : (
          <FileUploadForm meetingId={meetingId} taskId={taskId} />
        )}
        <BackLink to={`/pelatihanku/${data?.meeting.training.id}`} />
      </div>
    </div>
  );
};
