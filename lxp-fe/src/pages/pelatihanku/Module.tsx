import { Link, useParams } from "react-router-dom";
import { useGetModule } from "../../hooks/useModule";
import { Breadcrumb } from "../../Components/BreadCrumbs";
import { BackLink } from "../../Components/BackLink";
import { IoDocumentText } from "react-icons/io5";
import { ModuleSubmitDialog } from "./components/ModuleSubmitDialog";
import { FaCheck } from "react-icons/fa6";

export const Module = () => {
  const { meetingId, moduleId } = useParams<{
    meetingId: string;
    moduleId: string;
  }>();

  const { data, isLoading, error, refetch } = useGetModule(meetingId, moduleId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-white flex flex-col items-center mt-5 md:px-8 px-4 md:py-14 py-10 justify-center rounded-lg">
        <h1 className="font-bold md:text-4xl text-xl md:mb-8 mb-4">
          {data?.title}
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-start md:gap-6 gap-16  bg-white w-full">
          {/* Left Section */}
          <div className="flex flex-col items-center h-full bg-white  md:p-6 p-4 w-full md:w-1/2">
            <div className="flex flex-col items-center">
              <img
                src="/dashboard/empty-state.png"
                alt="Illustration"
                className="md:h-96 mb-1"
              />
              <p className="text-gray-500 text-sm md:text-lg">
                Tidak ada video
              </p>
            </div>
            <div className="w-full flex flex-col pt-14">
              <hr className="border-t-[1px] border-gray-300 w-full" />
              <p className="text-gray-500 md:text-base text-sm pt-5">
                "Tidak ada deskripsi"
              </p>
            </div>
            <div className="w-full flex items-center md:pt-0 pt-4 justify-between">
              {/* TODO */}
              <BackLink to={`/pelatihanku/${data?.meeting.training.id}`} />
              <Link
                to={``}
                className=" px-4 md:py-2 py-3 bg-blue-600 text-white rounded text-center md:text-base text-xs hover:bg-blue-700"
              >
                Lanjutkan Ke Kuis
              </Link>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex flex-col h-full justify-between bg-white  p-10 w-full md:w-1/2 ">
            <div>
              <div className="mb-4">
                <h2 className="text-gray-700 md:text-xl text-base font-semibold">
                  Video
                </h2>
                <p className="text-gray-500 md:text-base text-sm py-5">
                  Tidak ada video
                </p>
                <hr className="border-t-[1px] border-gray-300 w-full" />
              </div>
              <div className="mb-4">
                <h2 className="text-gray-700 font-semibold ">Dokumen</h2>
                <button
                  onClick={() =>
                    window.open(
                      `http://localhost:3001/public/${data?.content}`,
                      "_blank"
                    )
                  }
                  className="text-gray-500 flex items-center w-full border-[1px] rounded-lg p-4 my-5 gap-3"
                >
                  <IoDocumentText className="text-3xl text-red-500" />
                  <span className="md:text-base text-xs text-left">
                    {data?.title}
                  </span>
                </button>
                <hr className="border-t-[1px] border-gray-300 w-full" />
              </div>
              <div className="mb-4">
                <h2 className="text-gray-700 text-base md:text-xl font-semibold">
                  Jurnal
                </h2>
                <p className="text-gray-500 md:text-base text-sm py-5">
                  Tidak ada Jurnal
                </p>
                <hr className="border-t-[1px] border-gray-300 w-full" />
              </div>
              <div className="mb-4">
                <h2 className="text-gray-700 text-base md:text-xl font-semibold">
                  Artikel
                </h2>
                <p className="text-gray-500 md:text-base text-sm py-5">
                  Tidak ada Artikel
                </p>
                <hr className="border-t-[1px] border-gray-300 w-full" />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex justify-center">
                {data?.moduleAnswer ? (
                  <button className="mt-4 md:px-20 px-10 py-4 flex rounded-lg items-center bg-green-500 text-base md:text-xl gap-3 text-white hover:bg-green-600">
                    <div className="bg-white rounded-full">
                      <FaCheck className="text-green-600 p-1 text-xl" />
                    </div>
                    Modul Selesai
                  </button>
                ) : (
                  <ModuleSubmitDialog
                    moduleId={data?.id}
                    onComplete={() => {
                      refetch();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
