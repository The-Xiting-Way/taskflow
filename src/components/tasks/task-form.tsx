
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTaskStore } from "@/stores/taskStore";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { Department, User } from "@/types";
import { useNotificationStore } from "@/stores/notificationStore";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { format } from "date-fns";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskForm({ isOpen, onClose }: TaskFormProps) {
  const { user } = useAuthStore();
  const { addTask } = useTaskStore();
  const { getUsers, getUsersByDepartment } = useUserStore();
  const { addNotification } = useNotificationStore();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  const [department, setDepartment] = useState<Department>(user?.department || "Development");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
    setDepartment(user?.department || "Development");
    setAssignedTo([]);
    setTag("");
    setTags([]);
  };
  
  const handleSubmit = () => {
    if (!user) return;
    
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    if (assignedTo.length === 0) {
      toast.error("Please assign the task to at least one team member");
      return;
    }
    
    addTask({
      title,
      description,
      status: "Todo",
      deadline: new Date(deadline).toISOString(),
      assignedBy: user.id,
      assignedTo,
      department,
      tags
    });
    
    // Create notifications for assigned users
    assignedTo.forEach(userId => {
      addNotification({
        type: 'assignment',
        message: `${user.name} assigned you to "${title}"`,
        userId: user.id,
        targetUserId: userId
      });
    });
    
    toast.success("Task created successfully");
    resetForm();
    onClose();
  };
  
  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const handleUserSelection = (userId: string) => {
    setAssignedTo(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const departmentUsers = getUsersByDepartment(department);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your workflow
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task in detail"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={(value: Department) => setDepartment(value)}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Assign To</Label>
            <div className="mt-2 border rounded-md p-2 max-h-32 overflow-y-auto">
              {departmentUsers.map((user: User) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-50 ${
                    assignedTo.includes(user.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleUserSelection(user.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${user.isAvailable ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
                    <span>{user.name}</span>
                  </div>
                  {assignedTo.includes(user.id) && <Check size={16} className="text-blue-500" />}
                </div>
              ))}
              {departmentUsers.length === 0 && (
                <div className="p-2 text-gray-500 text-sm">No users in this department</div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center">
              <Input
                id="tags"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Enter a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-epack-purple hover:bg-epack-dark-purple">Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
