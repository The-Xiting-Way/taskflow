
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusClass = () => {
    switch (status) {
      case "Todo":
        return "status-badge-todo";
      case "In Progress":
        return "status-badge-progress";
      case "In Review":
        return "status-badge-review";
      case "Completed":
        return "status-badge-completed";
      default:
        return "status-badge-todo";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Todo":
        return "□";
      case "In Progress":
        return "▶";
      case "In Review":
        return "⟳";
      case "Completed":
        return "✓";
      default:
        return "□";
    }
  };

  return (
    <span className={cn(getStatusClass(), className)}>
      <span className="mr-1">{getStatusIcon()}</span>
      {status}
    </span>
  );
}
