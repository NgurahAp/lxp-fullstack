import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import FeatureBox from "./FeatureBox";

const NavbarHome: React.FC = () => {
  // const { authState } = useAuth();
  // const { data: dashboardData, isLoading } = useDashboardData();

  const [showFeatures, setShowFeatures] = useState(false);
  // const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFeatures = () => {
    setShowFeatures((prev) => !prev);
    // setShowProfileMenu(false);
  };

  // const toggleProfileMenu = () => {
  //   setShowProfileMenu((prev) => !prev);
  //   setShowFeatures(false);
  // };

  const handleCloseFeatures = () => {
    setShowFeatures(false);
  };

  // const handleCloseProfileMenu = () => {
  //   setShowProfileMenu(false);
  // };
  return (
    <nav className="fixed top-0 left-0 w-full z-10 flex justify-between items-center py-2 px-4 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <img
            src="/landing/logo.png"
            className="md:w-40 w-32 bg-white bg-opacity-20 rounded"
            alt="Logo"
          />
        </div>
      </div>

      {/* Hamburger Menu Button - Only visible on mobile */}
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-3">
        <div className="flex gap-4">
          <button
            onClick={toggleFeatures}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center"
          >
            Semua Fitur
            <img
              src="/landing/semua-fitur.png"
              className="pl-2 w-5 h-auto"
              alt=""
            />
          </button>
          {showFeatures && (
            <FeatureBox offset="md:right-28" onClose={handleCloseFeatures} />
          )}
          <Link to="/login">
            <button className="border border-[#106fa4] text-[#106fa4] px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-50">
              Masuk
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu - Only visible when hamburger is clicked */}

      <div className="md:hidden absolute top-full right-0 w-full bg-white shadow-lg rounded-lg  py-2 z-20">
        <div className="flex justify-between p-4">
          <button
            onClick={toggleFeatures}
            className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded-lg font-medium flex items-center justify-center"
          >
            Semua Fitur
            <img
              src="/landing/semua-fitur.png"
              className="pl-2 w-5 h-auto"
              alt=""
            />
          </button>
          {showFeatures && (
            <FeatureBox offset="right-1" onClose={handleCloseFeatures} />
          )}
          <Link to="/login" className="">
            <button className="w-full border border-[#106fa4] text-[#106fa4] text-sm px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
              Masuk
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;
