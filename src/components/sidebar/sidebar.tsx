
import { useState } from "react";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import { MobileMenu } from "./mobile-menu";
import { SidebarNavigation } from "./sidebar-navigation";
import { UserProfile } from "./user-profile";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  if (!user) return null;
  
  const unreadCount = getUnreadCount();
  
  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 70 }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={20} />
      </Button>
      
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-30 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <MobileMenu 
              isOpen={isMobileOpen}
              onClose={() => setIsMobileOpen(false)}
              unreadCount={unreadCount}
            />
          </>
        )}
      </AnimatePresence>
      
      <motion.aside
        className={cn(
          "bg-white border-r border-gray-200 h-screen sticky top-0 hidden md:flex flex-col z-30",
          className
        )}
        variants={sidebarVariants}
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-epack-purple rounded-md flex items-center justify-center text-white font-bold">
                E
              </div>
              <h1 className="ml-2 text-lg font-bold">Epack Taskflow</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            <Menu size={18} />
          </Button>
        </div>
        
        <SidebarNavigation unreadCount={unreadCount} />
        <UserProfile className="border-t p-4" isCollapsed={isCollapsed} />
      </motion.aside>
    </>
  );
}
