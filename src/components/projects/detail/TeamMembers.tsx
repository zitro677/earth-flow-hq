
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { updateProject } from "../hooks/projectOperations";

interface TeamMembersProps {
  teamMembers: Array<{ name: string; role: string; avatar: string }>;
  setTeamMembers: React.Dispatch<React.SetStateAction<Array<{ name: string; role: string; avatar: string }>>>;
  projectId: string;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ teamMembers, setTeamMembers, projectId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: "", role: "" });

  const saveTeamToProject = (updatedTeam: Array<{ name: string; role: string; avatar: string }>) => {
    // Update the project in database
    updateProject(projectId, { team: updatedTeam });
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.name.trim() === "") {
      toast.error("Team member name is required");
      return;
    }
    
    const newMember = {
      name: newTeamMember.name,
      role: newTeamMember.role || "Team Member",
      avatar: ""
    };
    
    const updatedTeam = [...teamMembers, newMember];
    
    // Update local state
    setTeamMembers(updatedTeam);
    
    // Persist to database
    saveTeamToProject(updatedTeam);
    
    setNewTeamMember({ name: "", role: "" });
    setDialogOpen(false);
    
    toast.success("Team member added successfully");
  };

  const handleRemoveTeamMember = (index: number) => {
    const updatedTeam = [...teamMembers];
    updatedTeam.splice(index, 1);
    
    // Update local state
    setTeamMembers(updatedTeam);
    
    // Persist to database
    saveTeamToProject(updatedTeam);
    
    toast.success("Team member removed");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="col-span-full lg:col-span-1"
      >
        <Card className="card-shadow">
          <CardHeader className="flex flex-row justify-between items-start">
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveTeamMember(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {teamMembers.length === 0 && (
                <p className="text-muted-foreground text-center py-2">No team members assigned yet</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full gap-1"
              onClick={() => setDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Team Member</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Dialog for adding team members */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to this project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newTeamMember.name}
                onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Input
                id="role"
                placeholder="Landscape Designer"
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeamMember}>
              Add Team Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamMembers;
