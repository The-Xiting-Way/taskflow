
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface AvailabilityDialogProps {
  userId: string;
}

export function AvailabilityDialog({ userId }: AvailabilityDialogProps) {
  const { updateUser } = useUserStore();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const isMobile = useIsMobile();

  const handleSetAvailability = () => {
    if (!startDate || !endDate) return;

    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    endDateTime.setHours(endHours, endMinutes);

    updateUser(userId, {
      availabilitySchedule: {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Set Availability</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Set Availability</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className={cn(
              "flex gap-4",
              isMobile ? "flex-col" : "flex-row"
            )}>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Start Date</h3>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className={cn("rounded-md border")}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">End Date</h3>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className={cn("rounded-md border")}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button onClick={handleSetAvailability}>Save Availability</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
