
import { LayoutDashboard, ListTodo, Users, MessageSquare } from "lucide-react";
import { SidebarLink } from "./sidebar-link";
import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
  unreadCount?: number;
  className?: string;
}

export function SidebarNavigation({ unreadCount, className }: SidebarNavigationProps) {
  return (
    <div className={cn("flex-1 px-3 py-4 space-y-2 overflow-y-auto", className)}>
      <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
      <SidebarLink to="/tasks" icon={ListTodo} label="Tasks" />
      <SidebarLink to="/team" icon={Users} label="Team" />
      <SidebarLink to="/conversations" icon={MessageSquare} label="Conversations" badge={unreadCount} />
    </div>
  );
}
