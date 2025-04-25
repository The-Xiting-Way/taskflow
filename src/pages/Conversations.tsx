
import { ConversationPanel } from "@/components/conversations/conversation-panel";
import { motion } from "framer-motion";

const ConversationsPage = () => {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          Chat with team members by department
        </p>
      </motion.div>
      
      <ConversationPanel />
    </div>
  );
};

export default ConversationsPage;
