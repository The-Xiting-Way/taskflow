
import { User } from "@/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AvailabilityDialog } from "./availability-dialog";
import { formatDateTime } from "@/utils/dateUtils";
import { useAuthStore } from "@/stores/authStore";

interface TeamCardProps {
  user: User;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TeamCard({ user, onClick, isSelected }: TeamCardProps) {
  const currentUser = useAuthStore(state => state.user);
  const isScheduledAvailable = user.availabilitySchedule && new Date() >= new Date(user.availabilitySchedule.startTime) && new Date() <= new Date(user.availabilitySchedule.endTime);

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer hover:shadow-md transition-all",
        isSelected && "ring-2 ring-epack-purple bg-epack-light-purple"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-epack-purple text-white">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{user.name}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    isScheduledAvailable ? "bg-green-500" : "bg-red-500"
                  )} />
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
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 inline-block">{user.department}</p>
            {currentUser?.id === user.id && (
              <AvailabilityDialog userId={user.id} />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
