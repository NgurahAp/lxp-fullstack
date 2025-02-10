export const SearchBar: React.FC = () => {
  return (
    <div className="flex items-center w-full md:px-8 px-4 pt-8">
      {/* Input search */}
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search"
          className="w-full py-3 md:pl-10 pl-9 pr-12 md:text-base text-sm bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {/* Icon search di sebelah kiri */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <img
            src="/pelatihanku/search.png"
            alt="Search Icon"
            className="h-4 md:h-5 w-4 md:w-5"
          />
        </div>
      </div>

      <button className="ml-2 md:h-12 h-11 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        <img
          src="/pelatihanku/search-right.png"
          alt="Search Icon"
          className="h-4 w-4"
        />
      </button>
    </div>
  );
};
