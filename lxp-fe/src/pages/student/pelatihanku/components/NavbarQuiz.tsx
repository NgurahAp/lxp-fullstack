import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationDialog from "./NavConfirmDialog";
import ProfileBox from "../../../../Components/ProfileBox";
import { UserData } from "../../../../types/auth";

export const NavbarQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleCloseProfileMenu = () => {
    setShowProfileMenu(false);
  };

  const handleNavigation = (path: string) => {
    setPendingNavigation(path);
    setShowNavigationDialog(true);
  };

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowNavigationDialog(false);
    setPendingNavigation(null);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleCancelNavigation = () => {
    setShowNavigationDialog(false);
    setPendingNavigation(null);
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Pelatihan-ku", path: "/pelatihanku" },
    { name: "Penugasan", path: "/penugasan" },
    { name: "Nilai & Sertifikat", path: "/nilai-sertifikat" },
    // { name: "Roleplay & Asesmen", path: "/roleplay" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
        <div className="flex justify-between px-4 md:px-24 h-16 items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/navbar/logo.png"
              className="w-32 md:w-36 bg-white bg-opacity-20 rounded"
              alt="Logo"
            />
          </div>

          <div className="flex items-center space-x-4 md:space-x-8">
            {!isMobile && (
              <>
                <button onClick={() => handleNavigation("/dashboard")}>
                  <img src="/navbar/square.png" className="px-1 w-6" alt="" />
                </button>
                <img src="/navbar/moon.png" className="px-1 w-7" alt="" />
                <img src="/navbar/bell.png" className="px-1 w-7" alt="" />
                <img src="/navbar/separator.png" className="px-4" alt="" />
                <button
                  onClick={toggleProfileMenu}
                  className="relative w-10 h-10 rounded-full overflow-hidden"
                >
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
                </button>
                {showProfileMenu && (
                  <ProfileBox
                    offset="right-[9rem]"
                    onClose={handleCloseProfileMenu}
                  />
                )}
              </>
            )}
            {isMobile && (
              <button onClick={() => setIsOpen(!isOpen)} className="text-3xl">
                ☰
              </button>
            )}
          </div>
        </div>

        {/* Navbar items for desktop */}
        {!isMobile && (
          <div className="bg-sky-700">
            <div className="flex h-16 items-center space-x-8 md:space-x-14 px-4 md:px-36">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`font-semibold text-sm md:text-base ${
                    location.pathname.startsWith(item.path)
                      ? "text-green-300"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navbar for mobile */}
        {isMobile && isOpen && (
          <div className="bg-sky-700">
            <div className="p-4 border-b border-sky-600">
              <img
                src={profileData?.avatar}
                className="w-12 h-12 rounded-full mx-auto"
                alt="Profile"
              />
              <p className="text-white text-center mt-2">{profileData?.name}</p>
            </div>
            <div className="flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`font-semibold text-lg p-4 ${
                    location.pathname === item.path
                      ? "text-green-300"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {showNavigationDialog && (
        <NavigationDialog
          onClose={handleCancelNavigation}
          onConfirm={handleConfirmNavigation}
        />
      )}
    </>
  );
};
