
import { format } from "date-fns";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};

// Parse proposal content into sections
export const parseProposalContent = (content?: string) => {
  if (!content) return {
    "Project Scope": "",
    "Project Timeline": "",
    "Items & Services": "",
    "Terms & Notes": ""
  };
  
  console.log("Parsing content:", content);
  
  // Initialize with empty sections
  const sections: Record<string, string> = {
    "Project Scope": "",
    "Project Timeline": "",
    "Items & Services": "",
    "Terms & Notes": ""
  };

  // Check if the content has the timeline, items, and notes markers
  const hasTimeline = content.includes("Timeline:");
  const hasItems = content.includes("Items:");
  const hasNotes = content.includes("Notes:");
  
  // If no markers exist, put all content in Project Scope
  if (!hasTimeline && !hasItems && !hasNotes) {
    sections["Project Scope"] = content.trim();
    return sections;
  }
  
  // Extract scope (everything before Timeline: or Items: or Notes:)
  let scopeEndIndex = content.length;
  if (hasTimeline) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Timeline:"));
  }
  if (hasItems) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Items:"));
  }
  if (hasNotes) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Notes:"));
  }
  
  sections["Project Scope"] = content.substring(0, scopeEndIndex).trim();
  
  // Extract timeline section if it exists
  if (hasTimeline) {
    const timelineStartIndex = content.indexOf("Timeline:") + "Timeline:".length;
    let timelineEndIndex = content.length;
    if (hasItems) {
      timelineEndIndex = Math.min(timelineEndIndex, content.indexOf("Items:"));
    }
    if (hasNotes) {
      timelineEndIndex = Math.min(timelineEndIndex, content.indexOf("Notes:"));
    }
    sections["Project Timeline"] = content.substring(timelineStartIndex, timelineEndIndex).trim();
  }
  
  // Extract items section if it exists
  if (hasItems) {
    const itemsStartIndex = content.indexOf("Items:") + "Items:".length;
    let itemsEndIndex = content.length;
    if (hasNotes) {
      itemsEndIndex = Math.min(itemsEndIndex, content.indexOf("Notes:"));
    }
    sections["Items & Services"] = content.substring(itemsStartIndex, itemsEndIndex).trim();
  }
  
  // Extract notes section if it exists
  if (hasNotes) {
    const notesStartIndex = content.indexOf("Notes:") + "Notes:".length;
    sections["Terms & Notes"] = content.substring(notesStartIndex).trim();
  }
  
  // Additional check: search for data from proposal_items table
  // This is a fallback in case the content doesn't have the expected markers
  if (!hasTimeline && !hasItems && !hasNotes) {
    if (content.includes("scope:")) {
      const scopeMatch = content.match(/scope:(.*?)(?=timeline:|items:|notes:|$)/is);
      if (scopeMatch && scopeMatch[1]) {
        sections["Project Scope"] = scopeMatch[1].trim();
      }
    }
    
    if (content.includes("timeline:")) {
      const timelineMatch = content.match(/timeline:(.*?)(?=items:|notes:|$)/is);
      if (timelineMatch && timelineMatch[1]) {
        sections["Project Timeline"] = timelineMatch[1].trim();
      }
    }
    
    if (content.includes("items:")) {
      const itemsMatch = content.match(/items:(.*?)(?=notes:|$)/is);
      if (itemsMatch && itemsMatch[1]) {
        sections["Items & Services"] = itemsMatch[1].trim();
      }
    }
    
    if (content.includes("notes:")) {
      const notesMatch = content.match(/notes:(.*?)$/is);
      if (notesMatch && notesMatch[1]) {
        sections["Terms & Notes"] = notesMatch[1].trim();
      }
    }
  }
  
  console.log("Parsed sections:", sections);
  
  return sections;
};
