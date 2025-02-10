import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

interface BreadcrumbItem {
  label: string | undefined;
  path?: string | undefined;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="bg-white w-full min-h-14 flex items-center px-5 rounded-xl py-2">
      <div className="flex items-center flex-wrap whitespace-normal gap-x-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index === 0 && (
              <div className="flex-shrink-0">
                <img
                  src="/pelatihanku/home.png"
                  className="md:w-5 w-4 -mt-1 md:block hidden"
                  alt="Home"
                />
              </div>
            )}
            {item.path ? (
              <Link to={item.path} className="flex items-center">
                <span
                  className={`${
                    index === 0 ? "md:px-2 px-0" : ""
                  } text-blue-500 md:text-sm text-xs  md:font-semibold`}
                >
                  {item.label}
                </span>
              </Link>
            ) : (
              <span
                className={`${
                  index === 0 ? "md:px-2 px-0" : ""
                } text-gray-400 md:text-sm text-xs  md:font-semibold`}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <FaChevronRight className="text-gray-300 md:mx-2 mx-2 text-xs flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
