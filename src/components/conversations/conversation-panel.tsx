
import { useMessageStore } from "@/stores/messageStore";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { Department } from "@/types";
import { formatTime, formatDate } from "@/utils/dateUtils";
import { useUserStore } from "@/stores/userStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

export function ConversationPanel() {
  const { user } = useAuthStore();
  const { messages, addMessage, getMessagesByDepartment } = useMessageStore();
  const { getUserById } = useUserStore();
  
  const [activeTab, setActiveTab] = useState<Department>("HR");
  const [newMessage, setNewMessage] = useState("");
  
  if (!user) return null;
  
  const departmentMessages = getMessagesByDepartment(activeTab);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    addMessage({
      senderId: user.id,
      content: newMessage,
      department: activeTab
    });
    
    setNewMessage("");
  };
  
  // Group messages by date
  const groupedMessages = departmentMessages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);
  
  const dateGroups = Object.keys(groupedMessages).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  
  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <Tabs defaultValue="HR" value={activeTab} onValueChange={(value: Department) => setActiveTab(value)}>
        <div className="border-b px-4">
          <TabsList className="h-12">
            <TabsTrigger value="HR">HR</TabsTrigger>
            <TabsTrigger value="Design">Design</TabsTrigger>
            <TabsTrigger value="Development">Development</TabsTrigger>
            <TabsTrigger value="Marketing">Marketing</TabsTrigger>
            <TabsTrigger value="Sales">Sales</TabsTrigger>
            <TabsTrigger value="Management">Management</TabsTrigger>
          </TabsList>
        </div>
        
        {(['HR', 'Design', 'Development', 'Marketing', 'Sales', 'Management'] as Department[]).map((dept) => (
          <TabsContent
            key={dept}
            value={dept}
            className="flex-1 flex flex-col p-0 m-0"
          >
            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
              {dateGroups.map((date) => (
                <div key={date} className="mb-6">
                  <div className="text-xs text-center text-gray-500 my-2 relative">
                    <span className="bg-white px-2 relative z-10">{date}</span>
                    <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 -z-0" />
                  </div>
                  
                  {groupedMessages[date].map((message) => {
                    const sender = getUserById(message.senderId);
                    const isOwnMessage = message.senderId === user.id;
                    
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex mb-4",
                          isOwnMessage ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage src={sender?.avatar} />
                            <AvatarFallback className="bg-epack-purple text-white text-xs">
                              {sender?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={cn(
                          "max-w-[70%]",
                          isOwnMessage ? "items-end" : "items-start"
                        )}>
                          {!isOwnMessage && (
                            <p className="text-xs font-medium mb-1">{sender?.name}</p>
                          )}
                          
                          <div className={cn(
                            "rounded-lg p-3",
                            isOwnMessage 
                              ? "bg-epack-purple text-white rounded-tr-none" 
                              : "bg-gray-100 text-gray-800 rounded-tl-none"
                          )}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          
                          <p className={cn(
                            "text-xs text-gray-500 mt-1",
                            isOwnMessage ? "text-right" : "text-left"
                          )}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        
                        {isOwnMessage && (
                          <Avatar className="h-8 w-8 ml-2 mt-1">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-epack-purple text-white text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
              
              {departmentMessages.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages in this department yet
                </div>
              )}
            </div>
            
            {/* Input area */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder={`Message ${dept}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
