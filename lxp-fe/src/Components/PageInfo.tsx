import React from "react";

interface PageInfoProps {
  title: string | undefined;
  subtitle?: string | undefined;
  className?: string;
}

const PageInfo: React.FC<PageInfoProps> = ({ title, subtitle, className }) => {
  return (
    <div
      className={`bg-white flex flex-col mt-5 p-5 md:p-8 justify-center rounded-lg ${className}`}
    >
      <h1 className="text-base md:text-2xl font-semibold pb-1 md:pb-1">
        {title}
      </h1>
      {subtitle && <p className="text-sm md:text-base">{subtitle}</p>}
    </div>
  );
};

export default PageInfo;
