import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

interface BackLinkProps {
  to: string;
}

export const BackLink: React.FC<BackLinkProps> = ({ to }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 md:p-5 p-2 underline justify-start text-sm text-blue-500"
    >
      <FaArrowLeft />
      Kembali
    </Link>
  );
};
