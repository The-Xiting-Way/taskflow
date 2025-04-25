
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTaskStore } from "@/stores/taskStore";
import { useUserStore } from "@/stores/userStore";
import { useState } from "react";
import { formatDate, isOverdue } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import { StatusBadge } from "../ui/status-badge";
import { Task, TaskStatus, Department } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TaskTable() {
  const { getTasks } = useTaskStore();
  const { getUserById } = useUserStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "All">("All");
  
  const tasks = getTasks();
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesDepartment = departmentFilter === "All" || task.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: TaskStatus | "All") => setStatusFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Todo">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={departmentFilter} onValueChange={(value: Department | "All") => setDepartmentFilter(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Management">Management</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const assignedBy = getUserById(task.assignedBy);
                const isTaskOverdue = isOverdue(task.deadline);
                
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={task.status} />
                    </TableCell>
                    <TableCell>{task.department}</TableCell>
                    <TableCell>{assignedBy?.name || "Unknown"}</TableCell>
                    <TableCell className={cn(isTaskOverdue && "text-red-500")}>
                      {formatDate(task.deadline)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tasks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
