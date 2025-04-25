
import { useState } from "react";
import { useTaskStore } from "@/stores/taskStore";
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./task-card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function KanbanBoard() {
  const { getTasks, deleteTask, updateTask } = useTaskStore();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  const allTasks = getTasks();
  
  // Group tasks by status
  const todoTasks = allTasks.filter(task => task.status === 'Todo');
  const inProgressTasks = allTasks.filter(task => task.status === 'In Progress');
  const inReviewTasks = allTasks.filter(task => task.status === 'In Review');
  const completedTasks = allTasks.filter(task => task.status === 'Completed');
  
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      toast.success('Task deleted');
      setTaskToDelete(null);
    }
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    updateTask(taskId, { status });
    toast.success(`Task moved to ${status}`);
  };
  
  const renderColumn = (title: string, tasks: Task[], status: TaskStatus) => {
    return (
      <div 
        className={cn(
          "bg-gray-50 rounded-lg p-4 min-w-[300px] w-full",
          status === 'Todo' && "border-t-4 border-gray-400",
          status === 'In Progress' && "border-t-4 border-amber-400",
          status === 'In Review' && "border-t-4 border-blue-400",
          status === 'Completed' && "border-t-4 border-green-400"
        )}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <h2 className="font-semibold mb-4 flex items-center justify-between">
          {title}
          <span className="bg-gray-200 text-gray-700 rounded-full px-2 text-xs">
            {tasks.length}
          </span>
        </h2>
        <div className="space-y-4 min-h-[200px]">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <TaskCard
                task={task}
                onDelete={(id) => setTaskToDelete(id)}
              />
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-md">
              <p className="text-gray-400 text-sm">No tasks</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="overflow-x-auto pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderColumn("To Do", todoTasks, "Todo")}
        {renderColumn("In Progress", inProgressTasks, "In Progress")}
        {renderColumn("In Review", inReviewTasks, "In Review")}
        {renderColumn("Completed", completedTasks, "Completed")}
      </div>

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-epack-purple hover:bg-epack-dark-purple">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
