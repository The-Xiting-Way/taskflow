
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  users: User[];
  maxAvatars?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarGroup({ 
  users, 
  maxAvatars = 3,
  size = "md",
  className
}: AvatarGroupProps) {
  const displayUsers = users.slice(0, maxAvatars);
  const remainingUsers = users.length - maxAvatars;
  
  const getAvatarSize = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6 text-xs";
      case "lg":
        return "h-10 w-10 text-base";
      default:
        return "h-8 w-8 text-sm";
    }
  };
  
  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayUsers.map((user) => (
        <Avatar key={user.id} className={cn(getAvatarSize(), "border-2 border-background")}>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-epack-purple text-white">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      ))}
      
      {remainingUsers > 0 && (
        <div className={cn(
          getAvatarSize(),
          "bg-gray-100 rounded-full border-2 border-background flex items-center justify-center text-gray-600 font-medium"
        )}>
          +{remainingUsers}
        </div>
      )}
    </div>
  );
}
