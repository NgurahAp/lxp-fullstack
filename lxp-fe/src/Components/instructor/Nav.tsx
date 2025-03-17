import React, { useEffect, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { UserData } from "../../types/auth";
import { useAuth } from "../../hooks/useAuth";

const TopNav: React.FC = () => {
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const getUserProfile = () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          const userData: UserData = JSON.parse(storedUser);
          setProfileData(userData);
        } else {
          console.log("Data profil tidak ditemukan di localStorage");
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    };

    getUserProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.getElementById("profile-dropdown");
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="text-xl font-bold">Dashboard Instructor</div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>

        <div id="profile-dropdown" className="relative pr-5">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            
            <span className="text-sm font-medium">
              {profileData?.name || "User"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 overflow-hidden">
             
              <div className="py-1">
                <a
                  href="/"
                  className="flex items-center text-sm px-5 py-3 text-red-500 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    logout();
                  }}
                >
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
