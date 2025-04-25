
import { useEffect, useState } from "react";
import { getTimeRemaining, isOverdue } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

interface DeadlineCountdownProps {
  deadline: string;
  className?: string;
}

export function DeadlineCountdown({ deadline, className }: DeadlineCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(deadline));
  const isTaskOverdue = isOverdue(deadline);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(deadline));
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [deadline]);
  
  const { days, hours, minutes } = timeRemaining;
  
  if (isTaskOverdue) {
    return (
      <div className={cn("text-red-500 font-medium flex items-center", className)}>
        <span className="mr-1">⚠</span>
        <span>Overdue</span>
      </div>
    );
  }
  
  if (days > 0) {
    return (
      <div className={cn("text-slate-600", className)}>
        {days} day{days !== 1 ? 's' : ''} remaining
      </div>
    );
  }
  
  if (hours > 0) {
    return (
      <div className={cn("text-amber-500", className)}>
        {hours} hour{hours !== 1 ? 's' : ''}, {minutes} min remaining
      </div>
    );
  }
  
  return (
    <div className={cn("text-red-500", className)}>
      {minutes} minute{minutes !== 1 ? 's' : ''} remaining
    </div>
  );
}
