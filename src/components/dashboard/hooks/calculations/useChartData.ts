
import { useMemo } from "react";

export const useChartData = (projects: any[], invoices: any[]) => {
  return useMemo(() => {
    console.log("Generating chart data from real data");

    // Generate revenue data from real invoices
    const revenueData = generateRevenueData(invoices);
    
    // Generate project status data from real projects
    const projectStatusData = generateProjectStatusData(projects);

    return {
      revenueData,
      projectStatusData
    };
  }, [projects, invoices]);
};

const generateRevenueData = (invoices: any[]) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const currentYear = new Date().getFullYear();

  return months.map((month, index) => {
    const monthStart = new Date(currentYear, index, 1);
    const monthEnd = new Date(currentYear, index + 1, 0);

    const monthlyRevenue = invoices?.filter(invoice => {
      if (!invoice.issue_date) return false;
      const invoiceDate = new Date(invoice.issue_date);
      return invoiceDate >= monthStart && 
             invoiceDate <= monthEnd && 
             invoice.status === 'Paid';
    }).reduce((sum, inv) => sum + parseFloat(inv.amount?.toString() || '0'), 0) || 0;

    return {
      name: month,
      revenue: monthlyRevenue,
      expenses: 0 // Default to 0 for expenses since we don't have expense data mapped to months yet
    };
  });
};

const generateProjectStatusData = (projects: any[]) => {
  const statusCounts = {
    'Completed': 0,
    'In Progress': 0,
    'Planning': 0,
    'On Hold': 0
  };

  projects?.forEach(project => {
    if (statusCounts.hasOwnProperty(project.status)) {
      statusCounts[project.status as keyof typeof statusCounts]++;
    }
  });

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: getStatusColor(status)
  }));
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    "Completed": "#10b981",
    "In Progress": "#3b82f6", 
    "Planning": "#8b5cf6",
    "On Hold": "#f59e0b"
  };
  return colorMap[status] || "#64748b";
};
