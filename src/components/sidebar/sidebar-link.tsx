
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export function SidebarLink({ to, icon: Icon, label, badge }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-epack-light-purple",
        isActive ? "bg-epack-light-purple text-epack-purple" : "text-slate-700"
      )}
    >
      <div className="relative">
        <Icon size={20} className={isActive ? "text-epack-purple" : "text-slate-700"} />
        
        {badge && badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-epack-purple px-1 text-xs text-white">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      
      <span className="text-sm font-medium">{label}</span>
      
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 h-8 w-1 rounded-r-full bg-epack-purple"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
}
