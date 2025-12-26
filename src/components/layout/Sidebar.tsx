
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSidebar } from "./hooks/useSidebar";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavItems from "./sidebar/SidebarNavItems";
import SidebarSettings from "./sidebar/SidebarSettings";
import SidebarSignOut from "./sidebar/SidebarSignOut";

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, closeSidebar }) => {
  const { handleSignOut, user } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 border-r bg-sidebar text-sidebar-foreground shadow-sm md:sticky md:z-0 md:translate-x-0 md:opacity-100",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <SidebarHeader />

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-2">
            <SidebarNavItems closeSidebar={closeSidebar} />
            <SidebarSettings />
          </div>

          <SidebarSignOut onSignOut={handleSignOut} />
        </ScrollArea>
      </motion.aside>
    </>
  );
};

export default Sidebar;
