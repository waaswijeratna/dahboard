"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/headerComponents/Header";
import MyNavs from "@/components/MyNavs";
import { SearchFilterProvider } from "./SearchFilterContext";

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No layout on login or exhibitionsGallery
  if (pathname === "/login" || pathname === "/exhibitionsGallery") {
    return <>{children}</>;
  }

  return (
    <SearchFilterProvider>
      <div className="flex h-[100vh]">
        {/* Sidebar */}
        <div className="w-2/9 h-full bg-white rounded-br-3xl">
          <div className="w-full h-full bg-white border-r border-gray-300 rounded-tr-3xl rounded-br-3xl">
            <div className="w-full"><MyNavs /></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full h-full flex flex-col">
          <div>
            <Header />
          </div>
          <div className="w-full h-full p-4">{children}</div>
        </div>
      </div>
    </SearchFilterProvider>
  );
}
