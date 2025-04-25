
import { Card } from "@/components/ui/card";
import { Task, User } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeadlineCountdown } from "@/components/ui/deadline-countdown";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { useUserStore } from "@/stores/userStore";
import { formatDate, isOverdue } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const { getUserById } = useUserStore();
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();
  
  const assignedUsers = task.assignedTo
    .map(id => getUserById(id))
    .filter(user => user !== undefined) as User[];
  
  const assignedBy = getUserById(task.assignedBy);
  const isTaskOverdue = isOverdue(task.deadline);
  
  const handleRequestUpdate = () => {
    if (!user) return;
    
    // Create notifications for all assignees
    task.assignedTo.forEach(userId => {
      addNotification({
        type: 'update-request',
        message: `${user.name} requested an update on "${task.title}"`,
        taskId: task.id,
        userId: user.id,
        targetUserId: userId
      });
    });
    
    toast.success('Update request sent');
    console.log('Update requested for task:', task.id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "task-card",
        isTaskOverdue && "task-card-overdue"
      )}>
        <div className="flex justify-between items-start mb-3">
          <StatusBadge status={task.status} />
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRequestUpdate}
            >
              <MessageSquare size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Deadline</span>
          <span className="text-xs font-medium">{formatDate(task.deadline)}</span>
        </div>
        
        <DeadlineCountdown deadline={task.deadline} className="mb-4 text-xs" />
        
        <div className="bg-gray-50 p-2 rounded-md flex items-center justify-between mt-2">
          <AvatarGroup users={assignedUsers} maxAvatars={3} size="sm" />
          
          <div className="text-xs">
            <span className="text-gray-500">Assigned by </span>
            <span className="font-medium">{assignedBy?.name}</span>
          </div>
        </div>
        
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {task.tags.map(tag => (
              <span 
                key={tag}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
