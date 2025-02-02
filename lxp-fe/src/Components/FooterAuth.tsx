const FooterAuth = () => {
  return (
    <footer className="h-full md:px-16 px-12 md:py-10 py-3 relative bg-[#F5F5F5]">
      <div className="flex md:flex-row md:text-base text-sm flex-col justify-between md:px-10">
        <h1 className="text-[#737373] text-center">
          2024 - www.lms.m-knows.com - Hak Cipta Dilindungi.
        </h1>
        <div className="md:flex gap-x-10 md:justify-normal hidden md:pt-0 pt-5 justify-between">
          <h1 className="text-[#737373]">Terms of Use </h1>
          <h1 className="text-[#737373]">Privacy policy </h1>
        </div>
      </div>
    </footer>
  );
};

export default FooterAuth;
