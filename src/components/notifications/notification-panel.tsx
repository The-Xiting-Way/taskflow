
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRelativeTimeString } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import { getNotificationIcon, getNotificationColor } from "@/utils/notificationUtils";
import { toast } from "sonner";

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { notifications, markAllAsRead, markAsRead, getUnreadCount } = useNotificationStore();
  
  const unreadCount = getUnreadCount();
  
  useEffect(() => {
    // Close panel when clicking outside
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.notification-panel')) return;
      if (target.closest('.notification-trigger')) return;
      setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('click', handleClick);
    }
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isOpen]);

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    toast.success("Notification marked as read");
  };
  
  if (!user) return null;
  
  const userNotifications = notifications.filter(n => n.targetUserId === user.id);
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="notification-trigger fixed top-4 right-4 z-40"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className={cn(
          "transition-colors",
          unreadCount > 0 && "text-epack-purple"
        )} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-epack-purple text-xs text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-panel fixed right-4 top-16 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs hover:text-epack-purple"
                    onClick={() => {
                      markAllAsRead();
                      toast.success("All notifications marked as read");
                    }}
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
              {userNotifications.length > 0 ? (
                userNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 hover:bg-gray-50 cursor-pointer transition-colors",
                      !notification.isRead && "bg-blue-50/50"
                    )}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0",
                        getNotificationColor(notification.type)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm line-clamp-2",
                          notification.isRead ? "text-gray-600" : "text-gray-900 font-medium"
                        )}>{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getRelativeTimeString(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-epack-purple self-start mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">No notifications yet</p>
                  <p className="text-xs mt-1 text-gray-400">When you get notifications, they'll show up here</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
