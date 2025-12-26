
import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our components
import TasksTab from "./tabs/TasksTab";
import MaterialsTab from "./tabs/MaterialsTab";
import NotesTab from "./tabs/NotesTab";

// Import our dialogs
import TaskDialog from "./dialogs/TaskDialog";
import MaterialDialog from "./dialogs/MaterialDialog";
import NoteDialog from "./dialogs/NoteDialog";

// Import custom hooks
import { useTabManager } from "./hooks/useTabManager";

interface ProjectTabsProps {
  extraData: any;
  getStatusColor: (status: string) => string;
  projectId: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ 
  extraData: initialExtraData, 
  getStatusColor, 
  projectId 
}) => {
  // Use our custom hooks for managing tabs, dialogs and forms
  const {
    extraData,
    saveExtraData,
    dialogState,
    dialogActions,
    formState,
    formActions
  } = useTabManager(projectId, initialExtraData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Tabs defaultValue="tasks" className="mb-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="pt-4">
          <TasksTab 
            tasks={extraData.tasks || []} 
            getStatusColor={getStatusColor} 
            onAddTaskClick={dialogActions.openTaskDialog} 
            projectId={projectId}
            saveExtraData={saveExtraData}
            extraData={extraData}
          />
        </TabsContent>

        <TabsContent value="materials" className="pt-4">
          <MaterialsTab 
            materials={extraData.materials || []} 
            getStatusColor={getStatusColor} 
            onAddMaterialClick={dialogActions.openMaterialDialog} 
            projectId={projectId}
            saveExtraData={saveExtraData}
            extraData={extraData}
          />
        </TabsContent>

        <TabsContent value="notes" className="pt-4">
          <NotesTab 
            notes={extraData.notes || []} 
            onAddNoteClick={dialogActions.openNoteDialog} 
          />
        </TabsContent>
      </Tabs>

      {/* Task Dialog */}
      <TaskDialog 
        open={dialogState.taskDialogOpen}
        onOpenChange={dialogActions.setTaskDialogOpen}
        newTask={formState.newTask}
        setNewTask={formActions.setNewTask}
        handleAddTask={() => formActions.handleAddTask(extraData, saveExtraData, dialogActions.closeTaskDialog)}
      />

      {/* Material Dialog */}
      <MaterialDialog 
        open={dialogState.materialDialogOpen}
        onOpenChange={dialogActions.setMaterialDialogOpen}
        newMaterial={formState.newMaterial}
        setNewMaterial={formActions.setNewMaterial}
        handleAddMaterial={() => formActions.handleAddMaterial(extraData, saveExtraData, dialogActions.closeMaterialDialog)}
      />

      {/* Note Dialog */}
      <NoteDialog 
        open={dialogState.noteDialogOpen}
        onOpenChange={dialogActions.setNoteDialogOpen}
        newNote={formState.newNote}
        setNewNote={formActions.setNewNote}
        handleAddNote={() => formActions.handleAddNote(extraData, saveExtraData, dialogActions.closeNoteDialog)}
      />
    </motion.div>
  );
};

export default ProjectTabs;
