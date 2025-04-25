
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatTime, formatDateTime } from "@/utils/dateUtils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AvailabilityDialog } from "@/components/team/availability-dialog";

interface UserProfileProps {
  className?: string;
  isCollapsed?: boolean;
}

export function UserProfile({ className, isCollapsed = false }: UserProfileProps) {
  const { user, logout } = useAuthStore();
  if (!user) return null;

  const userInitials = user.name.split(' ').map(n => n[0]).join('');
  const isScheduledAvailable = user.availabilitySchedule && 
    new Date() >= new Date(user.availabilitySchedule.startTime) && 
    new Date() <= new Date(user.availabilitySchedule.endTime);

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-epack-purple text-white">{userInitials}</AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
            isScheduledAvailable ? "bg-green-500" : "bg-red-500"
          )} />
        </div>
        
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">{user.department}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {user.availabilitySchedule 
                        ? `Available until ${formatTime(user.availabilitySchedule.endTime)}` 
                        : user.isAvailable ? "Available" : "Not Available"}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user.availabilitySchedule ? (
                      <p>Available from {formatDateTime(user.availabilitySchedule.startTime)} to {formatDateTime(user.availabilitySchedule.endTime)}</p>
                    ) : (
                      <p>{user.isAvailable ? "Available" : "Not Available"}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
        
        {!isCollapsed && (
          <div className="flex gap-2">
            <AvailabilityDialog userId={user.id} />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-xs"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
