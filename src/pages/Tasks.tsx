
import { useState } from "react";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskTable } from "@/components/tasks/task-table";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";

const TasksPage = () => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and organize your tasks
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "kanban" | "list")}
            className="hidden sm:block"
          >
            <TabsList>
              <TabsTrigger value="kanban">
                <LayoutGrid className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button className="bg-epack-purple hover:bg-epack-dark-purple" onClick={() => setIsTaskFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        </div>
      </motion.div>
      
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "kanban" | "list")}
        className="sm:hidden mb-6"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="kanban">
            <LayoutGrid className="h-4 w-4 mr-1" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-1" />
            List
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {view === "kanban" ? (
        <motion.div
          key="kanban"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <KanbanBoard />
        </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <TaskTable />
        </motion.div>
      )}
      
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
      />
    </div>
  );
};

export default TasksPage;
