
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProjectData } from "./useProjectData";

export const useTabManager = (projectId: string, initialExtraData: any = {}) => {
  const { toast } = useToast();
  
  // Use project data hook
  const { extraData, saveExtraData } = useProjectData(projectId);
  
  // Dialog state management
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  
  // Form state
  const [newTask, setNewTask] = useState({ name: "", status: "Not Started", dueDate: "", assignee: "" });
  const [newMaterial, setNewMaterial] = useState({ name: "", quantity: "", cost: "", status: "Pending Delivery" });
  const [newNote, setNewNote] = useState({ content: "" });
  
  // Ensure we have the latest data
  useEffect(() => {
    console.log("Tab manager received initial extra data:", initialExtraData);
  }, [initialExtraData]);
  
  // Dialog actions
  const openTaskDialog = () => setTaskDialogOpen(true);
  const openMaterialDialog = () => setMaterialDialogOpen(true);
  const openNoteDialog = () => setNoteDialogOpen(true);
  const closeTaskDialog = () => setTaskDialogOpen(false);
  const closeMaterialDialog = () => setMaterialDialogOpen(false);
  const closeNoteDialog = () => setNoteDialogOpen(false);
  
  // Form actions
  const handleAddTask = (extraData: any, saveExtraData: (data: any) => void, closeDialog?: () => void) => {
    if (!newTask.name.trim()) {
      toast({
        title: "Task Name Required",
        description: "Please enter a name for the task.",
        variant: "destructive"
      });
      return;
    }
    
    // Create the new task object with a unique ID
    const task = {
      id: `task-${Date.now()}`,
      name: newTask.name,
      status: newTask.status,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      assignee: newTask.assignee
    };
    
    // Create updated tasks array
    const updatedTasks = extraData.tasks ? [...extraData.tasks, task] : [task];
    
    // Create updated extraData
    const updatedExtraData = {
      ...extraData,
      tasks: updatedTasks
    };
    
    console.log("Saving task to extraData:", task);
    console.log("Updated tasks array:", updatedTasks);
    
    // Save to localStorage
    saveExtraData(updatedExtraData);
    
    // Show success toast
    toast({
      title: "Task Added",
      description: `Task "${newTask.name}" has been added to the project.`,
    });
    
    // Reset form
    setNewTask({ name: "", status: "Not Started", dueDate: "", assignee: "" });
    
    // Close dialog if callback provided
    if (closeDialog) closeDialog();
  };
  
  const handleAddMaterial = (extraData: any, saveExtraData: (data: any) => void, closeDialog?: () => void) => {
    if (!newMaterial.name.trim()) {
      toast({
        title: "Material Name Required",
        description: "Please enter a name for the material.",
        variant: "destructive"
      });
      return;
    }
    
    // Create the new material object with a unique ID
    const material = {
      id: `material-${Date.now()}`,
      name: newMaterial.name,
      quantity: newMaterial.quantity,
      cost: newMaterial.cost,
      status: newMaterial.status
    };
    
    // Create updated materials array
    const updatedMaterials = extraData.materials ? [...extraData.materials, material] : [material];
    
    // Create updated extraData
    const updatedExtraData = {
      ...extraData,
      materials: updatedMaterials
    };
    
    console.log("Saving material to extraData:", material);
    console.log("Updated materials array:", updatedMaterials);
    
    // Save to localStorage
    saveExtraData(updatedExtraData);
    
    // Show success toast
    toast({
      title: "Material Added",
      description: `Material "${newMaterial.name}" has been added to the project.`,
    });
    
    // Reset form
    setNewMaterial({ name: "", quantity: "", cost: "", status: "Pending Delivery" });
    
    // Close dialog if callback provided
    if (closeDialog) closeDialog();
  };
  
  const handleAddNote = (extraData: any, saveExtraData: (data: any) => void, closeDialog?: () => void) => {
    if (!newNote.content.trim()) {
      toast({
        title: "Note Content Required",
        description: "Please enter content for the note.",
        variant: "destructive"
      });
      return;
    }
    
    // Create the new note object with a unique ID and timestamp
    const note = {
      id: `note-${Date.now()}`,
      content: newNote.content,
      date: new Date().toISOString().split('T')[0],
      author: "Current User", // In a real app, get the user's name from auth
    };
    
    // Create updated notes array
    const updatedNotes = extraData.notes ? [...extraData.notes, note] : [note];
    
    // Create updated extraData
    const updatedExtraData = {
      ...extraData,
      notes: updatedNotes
    };
    
    console.log("Saving note to extraData:", note);
    console.log("Updated notes array:", updatedNotes);
    
    // Save to localStorage
    saveExtraData(updatedExtraData);
    
    // Show success toast
    toast({
      title: "Note Added",
      description: "Your note has been added to the project.",
    });
    
    // Reset form
    setNewNote({ content: "" });
    
    // Close dialog if callback provided
    if (closeDialog) closeDialog();
  };

  return {
    // Data
    extraData,
    saveExtraData,
    
    // Dialog state
    dialogState: {
      taskDialogOpen,
      materialDialogOpen,
      noteDialogOpen
    },
    
    // Dialog actions
    dialogActions: {
      openTaskDialog,
      openMaterialDialog,
      openNoteDialog,
      closeTaskDialog,
      closeMaterialDialog,
      closeNoteDialog,
      setTaskDialogOpen,
      setMaterialDialogOpen,
      setNoteDialogOpen
    },
    
    // Form state
    formState: {
      newTask,
      newMaterial,
      newNote
    },
    
    // Form actions
    formActions: {
      setNewTask,
      setNewMaterial,
      setNewNote,
      handleAddTask,
      handleAddMaterial,
      handleAddNote
    }
  };
};
