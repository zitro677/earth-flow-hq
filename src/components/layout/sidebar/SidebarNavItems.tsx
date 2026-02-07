import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  PenTool,
  BarChart3,
  FolderKanban,
  Users,
  Truck,
} from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Panel",
    path: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Facturas",
    path: "/invoices",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Propuestas",
    path: "/proposals",
    icon: <PenTool className="h-5 w-5" />,
  },
  {
    name: "Finanzas",
    path: "/finances",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    name: "Proyectos",
    path: "/projects",
    icon: <FolderKanban className="h-5 w-5" />,
  },
  {
    name: "Clientes",
    path: "/clients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Proveedores",
    path: "/suppliers",
    icon: <Truck className="h-5 w-5" />,
  },
];

interface SidebarNavItemsProps {
  closeSidebar: () => void;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ closeSidebar }) => {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => {
            if (window.innerWidth < 768) {
              closeSidebar();
            }
          }}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )
          }
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNavItems;
