/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaPhotoVideo, FaDonate, FaImages } from "react-icons/fa";

export default function MyNavs() {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation function
  const handleNavigation = (path: string) => {
    router.push(`/${path}`);
  };

  // Nav items
  const navItems = [
    { name: "Overview", icon: <FaPhotoVideo className="text-xl" />, path: "" },
    { name: "Exhibitions", icon: <FaPhotoVideo className="text-xl" />, path: "exhibitions" },
    { name: "Fundraising", icon: <FaDonate className="text-xl" />, path: "fundraising" },
    { name: "Advertisements", icon: <FaImages className="text-xl" />, path: "advertisements" },
    { name: "Notices", icon: <FaPhotoVideo className="text-xl" />, path: "notices" },
    { name: "Users", icon: <FaPhotoVideo className="text-xl" />, path: "users" },
    { name: "Moderators", icon: <FaPhotoVideo className="text-xl" />, path: "moderators" },
  ];

  return (
    <div className="w-full h-[100vh] p-4">
      <div className="h-[10%]">
        <div className="flex gap-1 items-center justify-start">
          <img src="images/logo.png" alt="logo" className="w-9 h-9 rounded-full object-cover mr-4" />
          <h3 className="font-semibold text-lg">Arthaze</h3>
        </div>
      </div>
      {/* Navigation List */}
      <ul className="flex flex-col justify-center items-baseline space-y-8 w-full h-[90%]">
        {navItems.map(({ name, icon, path }) => (
          <li
            key={path}
            className={`flex items-center space-x-3 cursor-pointer duration-300 
              ${pathname.includes(path) ? "text-primary font-bold" : "text-fourth hover:text-primary"}`}
            onClick={() => handleNavigation(path)}
          >
            {icon}
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
