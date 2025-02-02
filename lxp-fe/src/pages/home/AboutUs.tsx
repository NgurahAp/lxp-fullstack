export const AboutUs = () => {
  return (
    <section className="bg-[#106FA4] text-white md:py-12  md:px-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center md:m-10 mx-5 mt-5">
          <h1 className="text-2xl md:text-5xl font-bold md:pb-10 pb-5">
            Tentang <span className="text-[#FAB317]">LMS M-Knows</span>
          </h1>
          <p className="text-sm md:text-lg font-light pb-10">
            LMS M-Knows adalah sebuah platform LMS (Learning Management System)
            yang dirancang khusus untuk memenuhi kebutuhan perusahaan dalam
            mengelola pembelajaran dan pengembangan karyawan. Platform ini
            menyediakan berbagai fitur yang dapat membantu perusahaan dalam
            menyusun, mengelola, dan menyampaikan materi pembelajaran secara
            efektif.
          </p>
          <p className="text-sm md:text-lg font-light pb-10">
            Salah satu fitur utama dari LMS M-Knows adalah kemampuannya untuk
            membuat kursus-kursus yang disesuaikan dengan kebutuhan perusahaan.
            Perusahaan dapat membuat kursus-kursus yang bertujuan untuk
            pengembangan dan pelatihan karyawan, atau pembelajaran tertentu
            untuk meningkatkan keterampilan dan pengetahuan karyawan.
          </p>
          <p className="text-sm md:text-lg font-light ">
            Selain itu, LMS M-Knows juga dilengkapi dengan fitur pelacakan
            kemajuan belajar yang memungkinkan perusahaan untuk melihat sejauh
            mana karyawan menyelesaikan materi pembelajaran. Fitur ini
            memungkinkan perusahaan untuk mengidentifikasi karyawan yang mungkin
            memerlukan bantuan tambahan, serta memberikan laporan atas
            pencapaian mereka dalam pembelajaran. Platform ini memberikan solusi
            lengkap untuk mengelola pembelajaran dan pengembangan karyawan,
            sehingga membantu perusahaan tetap kompetitif di pasar yang terus
            berubah.
          </p>
        </div>
        <div className="relative flex items-center justify-center">
          <img
            src="/landing/bootcamp/aboutUs.png"
            alt="Person holding a laptop"
            className=" h-auto md:w-[80vh] w-2/3 mx-auto md:pb-0 pb-10"
          />
        </div>
      </div>
    </section>
  );
};
