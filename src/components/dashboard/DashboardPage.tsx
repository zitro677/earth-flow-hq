
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import OverviewCard from "./OverviewCard";
import RevenueChart from "./RevenueChart";
import ProjectStatusChart from "./ProjectStatusChart";
import AnimatedPage from "../shared/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "../ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, PenTool, FileText, FolderKanban } from "lucide-react";
import { useDashboardData } from "./hooks/useDashboardData";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    overviewStats, 
    revenueData, 
    projectStatusData, 
    recentProjects,
    isLoading 
  } = useDashboardData();

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Client",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        const colorMap: Record<string, string> = {
          "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          "Planning": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
          "On Hold": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
        };
        
        return (
          <Badge className={`${colorMap[status] || ""} hover:${colorMap[status] || ""}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "end_date",
      header: "Due Date",
      cell: ({ row }: any) => {
        const date = row.getValue("end_date");
        return date ? new Date(date).toLocaleDateString() : "Not set";
      },
    },
    {
      accessorKey: "budget",
      header: "Value",
      cell: ({ row }: any) => {
        const budget = row.getValue("budget");
        return budget ? `$${Number(budget).toLocaleString()}` : "Not set";
      },
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 mb-6">
            Overview of your landscape business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <OverviewCard
            title="Total Revenue"
            value={formatCurrency(overviewStats.totalRevenue)}
            description="vs. last month"
            icon={BarChart3}
            trend={overviewStats.revenueTrend}
            delay={0}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Active Projects"
            value={overviewStats.activeProjects.toString()}
            description={`${overviewStats.dueSoonProjects} due this week`}
            icon={FolderKanban}
            trend={0}
            delay={1}
            isLoading={isLoading}
          />
          <OverviewCard
            title="Pending Invoices"
            value={overviewStats.pendingInvoices.toString()}
            description={`${overviewStats.pendingInvoicesCount} invoices pending`}
            icon={FileText}
            trend={-4}
            delay={2}
            isLoading={isLoading}
          />
          <OverviewCard
            title="New Proposals"
            value={overviewStats.newProposals.toString()}
            description={`${overviewStats.pendingApprovals} awaiting approval`}
            icon={PenTool}
            trend={24}
            delay={3}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RevenueChart data={revenueData} isLoading={isLoading} />
          <ProjectStatusChart data={projectStatusData} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/projects")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={recentProjects}
                searchColumn="name"
                searchPlaceholder="Search projects..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default DashboardPage;
