import { TiHome } from "react-icons/ti";
import { FaLaptopCode } from "react-icons/fa6";
import { SiConvertio } from "react-icons/si";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiCertificate } from "react-icons/pi";
import { Link } from "react-router-dom";

interface FeatureBoxProps {
  offset: string;
  onClose: () => void;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ offset, onClose }) => {
  return (
    <div
      className={`absolute top-[4.5rem] w-96 rounded-lg shadow-lg ${offset}`}
    >
      <div className="w-full h-28 bg-blue-300 rounded-t-lg flex items-center justify-center">
        <h1 className="font-bold text-2xl">Fitur</h1>
      </div>
      <div className="w-full bg-white h-56 flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-4 items-center mb-4">
          <Link
            to="/dashboard"
            className="flex flex-col items-center"
            onClick={onClose}
          >
            <div className="bg-blue-500 rounded-lg w-16 h-16 flex items-center justify-center">
              <TiHome className="text-white text-3xl" />
            </div>
            <span className="text-xs mt-2 text-gray-700">Beranda</span>
          </Link>
          <Link
            to="/bootcamp"
            className="flex flex-col items-center"
            onClick={onClose}
          >
            <div className="bg-indigo-500 rounded-lg w-16 h-16 flex items-center justify-center">
              <FaLaptopCode className="text-white text-3xl" />
            </div>
            <span className="text-xs mt-2 text-gray-700">Bootcamp</span>
          </Link>
          <Link to="/" className="flex flex-col items-center" onClick={onClose}>
            <div className="bg-green-500 rounded-lg w-16 h-16 flex items-center justify-center">
              <SiConvertio className="text-white text-3xl" />
            </div>
            <span className="text-xs mt-2 text-gray-700">Konversi SKS</span>
          </Link>
        </div>

        <div className="flex justify-center gap-8">
          <Link
            to="/pelatihanku"
            className="flex flex-col items-center"
            onClick={onClose}
          >
            <div className="bg-purple-700 rounded-lg w-16 h-16 flex items-center justify-center">
              <FaChalkboardTeacher className="text-white text-3xl" />
            </div>
            <span className="text-xs mt-2 text-gray-700">Pelatihan-ku</span>
          </Link>
          <Link
            to="/nilai-sertifikat"
            className="flex flex-col items-center"
            onClick={onClose}
          >
            <div className="bg-teal-500 rounded-lg w-16 h-16 flex items-center justify-center">
              <PiCertificate className="text-white text-3xl" />
            </div>
            <span className="text-xs mt-2 text-gray-700">
              Nilai & Sertifikat
            </span>
          </Link>
        </div>
      </div>
      <Link
        to="/allFeatures"
        className="py-4 w-full flex justify-center  items-center bg-blue-300 rounded-b-lg"
        onClick={onClose}
      >
        Lihat Semua
      </Link>
    </div>
  );
};

export default FeatureBox;
