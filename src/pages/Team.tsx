
import { TeamGrid } from "@/components/team/team-grid";
import { motion } from "framer-motion";

const TeamPage = () => {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground">
          View and manage team members
        </p>
      </motion.div>
      
      <TeamGrid />
    </div>
  );
};

export default TeamPage;
