
import { useUserStore } from "@/stores/userStore";
import { TeamCard } from "./team-card";
import { Department } from "@/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function TeamGrid() {
  const { getUsers } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "All">("All");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  
  const users = getUsers();
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesDepartment = departmentFilter === "All" || user.department === departmentFilter;
    
    const matchesAvailability = showOnlyAvailable ? user.isAvailable : true;
    
    return matchesSearch && matchesDepartment && matchesAvailability;
  });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex gap-4">
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
          
          <div className="flex items-center space-x-2">
            <Switch
              id="available-only"
              checked={showOnlyAvailable}
              onCheckedChange={setShowOnlyAvailable}
            />
            <Label htmlFor="available-only">Available only</Label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredUsers.map(user => (
          <TeamCard key={user.id} user={user} />
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500">
            No team members found
          </div>
        )}
      </div>
    </div>
  );
}
