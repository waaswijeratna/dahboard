/* eslint-disable @next/next/no-img-element */
import UserProfile from "./userProfile";
import SearchBar from "./searchBar";
import Filters from "./Filters";

export default function Header() {
  return (
    <div className="w-full h-full py-5 px-5 flex items-center bg-white border-b border-gray-300 z-100">
      {/* Left Section: Logo & SearchBar */}
      <div className="flex items-center flex-1 gap-3">
        <div className="w-[25vw]">
          <SearchBar />
        </div>
        <div>
          <Filters />
        </div>
      </div>

      {/* Right Section: Notifications & UserProfile */}
      <div className="flex items-center justify-end flex-1 space-x-7">
        <UserProfile />
      </div>
    </div>
  );
}
