
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnimatedPage from "../shared/AnimatedPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Import refactored components
import ProjectHeader from "./detail/ProjectHeader";
import ProjectOverview from "./detail/ProjectOverview";
import TeamMembers from "./detail/TeamMembers";
import ProjectTabs from "./detail/ProjectTabs";
import { getProjectExtraData, getStatusColor } from "./detail/ProjectDataProvider";
import { useProjectData } from "./detail/hooks/useProjectData";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the project with the matching ID from database
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Use project data hook (only call it if we have an ID)
  const projectData = id ? useProjectData(id) : null;
  
  // Load project data from Supabase
  const loadProject = async () => {
    console.log("Loading project with ID:", id);
    
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log("No authenticated user");
        setLoading(false);
        return;
      }

      // Fetch project from Supabase
      const { data: projectData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } else if (projectData) {
        console.log("Project found:", projectData);
        setProject(projectData);
      } else {
        console.error("Project not found with ID:", id);
        setProject(null);
      }
    } catch (error) {
      console.error("Error loading project:", error);
      setProject(null);
    }
    
    setLoading(false);
  };
  
  // Load project when component mounts or ID changes
  useEffect(() => {
    loadProject();
  }, [id]);

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  // Set team members when project loads
  useEffect(() => {
    if (project?.team) {
      setTeamMembers(
        project.team.map((member: any) => {
          if (typeof member === 'string') {
            // Convert string team members to objects
            return { name: member, role: "Team Member", avatar: "" };
          }
          return member;
        })
      );
    }
  }, [project]);

  // Handle project updates (like progress changes)
  const handleProjectUpdate = () => {
    // Reload the project to get the latest data
    loadProject();
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Loading Project...</h1>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!project) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Project Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>The project you're looking for doesn't exist or has been removed.</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/projects")}
              >
                Return to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedPage>
    );
  }

  // Only attempt to use projectData if we have a valid ID
  const { extraData, saveExtraData } = projectData || { extraData: {}, saveExtraData: () => {} };

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Project Header */}
        <ProjectHeader 
          projectId={project.id}
          projectName={project.name}
          projectStatus={project.status}
          getStatusColor={getStatusColor}
          project={project}
          extraData={extraData}
          teamMembers={teamMembers}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Project Overview */}
          <ProjectOverview 
            project={project}
            extraData={extraData} 
            teamSize={teamMembers.length}
            saveExtraData={saveExtraData}
            onProjectUpdate={handleProjectUpdate}
          />

          {/* Team Members */}
          <TeamMembers 
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            projectId={project.id}
          />
        </div>

        {/* Project Tabs (Tasks, Materials, Notes) */}
        <ProjectTabs 
          extraData={extraData}
          getStatusColor={getStatusColor}
          projectId={project.id}
        />
      </div>
    </AnimatedPage>
  );
};

export default ProjectDetail;
