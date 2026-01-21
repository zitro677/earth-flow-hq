import React from "react";
import Logo from "@/components/shared/Logo";

const SidebarHeader: React.FC = () => {
  return (
    <div className="flex h-16 items-center justify-center border-b px-4 bg-[#1a2744]">
      <Logo size="md" />
    </div>
  );
};

export default SidebarHeader;
