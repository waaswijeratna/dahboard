"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/headerComponents/Header";
import MyNavs from "@/components/MyNavs";

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Render only children (no layout) on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Render only children (no layout) on login page
  if (pathname === "/exhibitionsGallery") {
    return <>{children}</>;
  }

  // Full layout for other routes
  return (
    <div className="flex h-[100vh]">
      <div className="w-2/9 h-full bg-white rounded-br-3xl">
        <div className="w-full h-full bg-white border-r border-gray-300 rounded-tr-3xl rounded-br-3xl">
          <div className="w-full"><MyNavs /></div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col">
        <div>
          <Header />
        </div>
        <div className="w-full h-full p-4">{children}</div>

      </div>

    </div>
  );
}