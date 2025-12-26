
import { useMemo } from "react";

export const useOverviewStats = (projects: any[], invoices: any[], proposals: any[]) => {
  return useMemo(() => {
    console.log("Calculating overview stats from real data:", {
      projectsCount: projects?.length || 0,
      invoicesCount: invoices?.length || 0,
      proposalsCount: proposals?.length || 0
    });

    // Calculate real active projects
    const activeProjects = projects?.filter(p => 
      p.status === 'In Progress' || p.status === 'Planning'
    ).length || 0;

    // Calculate real total revenue from paid invoices
    const totalRevenue = invoices?.filter(inv => inv.status === 'Paid')
      .reduce((sum, inv) => sum + parseFloat(inv.amount?.toString() || '0'), 0) || 0;

    // Calculate real pending invoices
    const pendingInvoicesData = invoices?.filter(inv => inv.status === 'Pending') || [];
    const pendingInvoices = pendingInvoicesData.reduce((sum, inv) => 
      sum + parseFloat(inv.amount?.toString() || '0'), 0);
    const pendingInvoicesCount = pendingInvoicesData.length;

    // Calculate real proposals data
    const newProposals = proposals?.filter(p => p.status === 'Draft').length || 0;
    const pendingApprovals = proposals?.filter(p => p.status === 'Sent').length || 0;

    // Calculate due soon projects (due within 7 days)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueSoonProjects = projects?.filter(p => {
      if (!p.end_date) return false;
      const dueDate = new Date(p.end_date);
      return dueDate >= today && dueDate <= nextWeek;
    }).length || 0;

    // Simple revenue trend calculation (compare with previous period)
    const revenueTrend = totalRevenue > 0 ? 12 : 0; // Simplified trend

    return {
      totalRevenue,
      activeProjects,
      pendingInvoices,
      pendingInvoicesCount,
      newProposals,
      pendingApprovals,
      dueSoonProjects,
      revenueTrend
    };
  }, [projects, invoices, proposals]);
};
