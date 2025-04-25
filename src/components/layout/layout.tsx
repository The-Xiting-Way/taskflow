
import { Sidebar } from "@/components/sidebar/sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import AuthForm from "@/components/auth/auth-form";
import { useNotificationStore } from "@/stores/notificationStore";
import { useEffect } from "react";
import { NotificationPanel } from "../notifications/notification-panel";

export function Layout() {
  const { isAuthenticated, user } = useAuthStore();
  const { notifications, markAsRead } = useNotificationStore();
  
  // Process notifications as they come in
  useEffect(() => {
    if (!user) return;
    
    // Find unread notifications for this user
    const unreadNotifications = notifications.filter(
      n => n.targetUserId === user.id && !n.isRead
    );
    
    // Show toast for new notifications
    unreadNotifications.forEach(notification => {
      // You can customize this to show actual toasts if desired
      console.log('New notification:', notification.message);
      
      // Automatically mark as read after a delay
      // In a real app, you might want to leave them unread until user interaction
      setTimeout(() => {
        markAsRead(notification.id);
      }, 5000);
    });
  }, [notifications, user, markAsRead]);
  
  if (!isAuthenticated) {
    return <AuthForm />;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="container py-8">
          <Outlet />
        </div>
      </div>
      <NotificationPanel />
      <Toaster position="top-right" richColors />
    </div>
  );
}
