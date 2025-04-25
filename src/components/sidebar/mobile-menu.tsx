
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNavigation } from "./sidebar-navigation";
import { UserProfile } from "./user-profile";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
}

export function MobileMenu({ isOpen, onClose, unreadCount }: MobileMenuProps) {
  const sidebarMobileVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 }
  };

  return (
    <motion.aside
      className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 flex flex-col"
      variants={sidebarMobileVariants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-epack-purple rounded-md flex items-center justify-center text-white font-bold">
            E
          </div>
          <h1 className="ml-2 text-lg font-bold">Epack Taskflow</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>

      <SidebarNavigation unreadCount={unreadCount} />
      <UserProfile className="border-t p-4" />
    </motion.aside>
  );
}
