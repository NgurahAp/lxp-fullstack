import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { UserData } from "../types/auth";

interface FeatureBoxProps {
  offset: string;
  onClose: () => void;
}

const ProfileBox: React.FC<FeatureBoxProps> = ({ offset, onClose }) => {
  const [profileData, setProfileData] = useState<UserData | null>(null);

  const { logout } = useAuth();

  useEffect(() => {
    const storedProfile = localStorage.getItem("user_data");
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
    }
  }, []);

  return (
    <div
      className={`absolute top-[4.5rem] w-96 rounded-lg bg-[#f5f5f5] shadow-lg ${offset}`}
    >
      <div className="flex p-4">
        <div className="w-10 h-10 mt-1">
          {profileData?.avatar ? (
            <img
              src={profileData.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-yellow-300 rounded-full text-gray-700 font-semibold">
              {profileData?.name
                ? profileData.name
                    .split(" ")
                    .slice(0, 2) // Ambil maksimal 2 kata pertama
                    .map((word) => word[0]) // Ambil huruf pertama setiap kata
                    .join("")
                    .toUpperCase() // Ubah ke huruf besar
                : "?"}
            </div>
          )}
        </div>
        <div className="flex flex-col pl-3 ">
          <h1 className="font-bold">{profileData?.name}</h1>
          <h1 className="font-normal">{profileData?.email}</h1>
        </div>
      </div>
      <div className="w-full border-t border-gray-300 mb-2" />
      <Link
        to="/"
        onClick={() => {
          onClose();
        }}
        className="flex p-4 items-center"
      >
        <MdHome className="text-2xl text-blue-500" />
        <div className="flex pl-4 text-lg font-semibold items-center">
          <h1 className="">Beranda</h1>
        </div>
      </Link>
      <Link
        to="/"
        onClick={() => {
          onClose();
          logout();
        }}
        className="flex p-4 items-center"
      >
        <CgProfile className="text-2xl" />
        <div className="flex pl-4 text-lg font-semibold items-center">
          <h1 className="">profile</h1>
        </div>
      </Link>
      <a
        href="/"
        onClick={() => {
          onClose();
          logout();
        }}
        className="flex p-4 items-center"
      >
        <CiLogout className="text-2xl text-red-500" />
        <div className="flex pl-4 text-lg font-semibold items-center">
          <h1 className="text-red-500">Logout</h1>
        </div>
      </a>
    </div>
  );
};

export default ProfileBox;
