
import React from "react";
import { getAllProjects } from "../hooks/projectData";
import { getStatusColor } from "../hooks/projectUtils";

// Extra data for demo purposes (will be stored with the project in a real app)
const projectExtraData = {
  "PRJ-2023-001": {
    totalCost: "$5,525",
    estimatedHours: 120,
    hoursLogged: 78,
    description: "Complete backyard renovation for the Johnson family. Project includes hardscaping with natural stone, installation of a cedar pergola, comprehensive irrigation system, and drought-resistant planting design. The client has requested a low-maintenance design with natural materials that complements their home's architectural style.",
    tasks: [
      { name: "Initial site assessment", status: "Completed", dueDate: "2023-10-12", assignee: "John Smith" },
      { name: "Design blueprint creation", status: "Completed", dueDate: "2023-10-25", assignee: "Maria Garcia" },
      { name: "Client design approval", status: "Completed", dueDate: "2023-10-30", assignee: "John Smith" },
      { name: "Material procurement", status: "Completed", dueDate: "2023-11-05", assignee: "John Smith" },
      { name: "Site preparation", status: "In Progress", dueDate: "2023-11-15", assignee: "Maria Garcia" },
      { name: "Hardscape installation", status: "In Progress", dueDate: "2023-11-30", assignee: "Maria Garcia" },
      { name: "Planting and softscape", status: "Not Started", dueDate: "2023-12-05", assignee: "Maria Garcia" },
      { name: "Irrigation setup", status: "Not Started", dueDate: "2023-12-10", assignee: "John Smith" },
      { name: "Final walkthrough", status: "Not Started", dueDate: "2023-12-15", assignee: "John Smith" },
    ],
    materials: [
      { name: "Premium Garden Soil", quantity: "5 cubic yards", cost: "$750", status: "Delivered" },
      { name: "Flagstone Pavers", quantity: "200 sq ft", cost: "$1,600", status: "Delivered" },
      { name: "Drought-Resistant Plants", quantity: "45 units", cost: "$900", status: "Delivered" },
      { name: "Cedar Pergola Kit", quantity: "1", cost: "$1,200", status: "Pending Delivery" },
      { name: "Irrigation System", quantity: "1 set", cost: "$650", status: "Pending Delivery" },
    ],
    notes: [
      { date: "2023-10-10", author: "John Smith", content: "Initial client meeting completed. Client prefers natural materials and drought-resistant plants." },
      { date: "2023-10-25", author: "Maria Garcia", content: "Design blueprints completed and sent to client for review." },
      { date: "2023-11-05", author: "John Smith", content: "Material delivery scheduled for next week. Site preparation to begin tomorrow." },
    ]
  }
};

// Default data for new projects
const defaultExtraData = {
  totalCost: "$0",
  estimatedHours: 0,
  hoursLogged: 0,
  description: "No description available yet.",
  tasks: [],
  materials: [],
  notes: []
};

// Function to generate extra data for a project if it doesn't exist
export const getProjectExtraData = async (projectId: string) => {
  // For new projects, use the description from the project if available
  if (!projectExtraData[projectId as keyof typeof projectExtraData]) {
    try {
      const projects = await getAllProjects();
      const project = projects.find(p => p.id === projectId);
      if (project && project.description) {
        return {
          ...defaultExtraData,
          description: project.description,
        };
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  }
  return projectExtraData[projectId as keyof typeof projectExtraData] || defaultExtraData;
};

// Re-export getAllProjects and getStatusColor to maintain API compatibility
export { getAllProjects, getStatusColor };
