
import { useState, useEffect } from "react";
import { useProjectsData } from "./data/useProjectsData";
import { useSupabaseData } from "./data/useSupabaseData";
import { useOverviewStats } from "./calculations/useOverviewStats";
import { useChartData } from "./calculations/useChartData";
import { useRecentProjects } from "./calculations/useRecentProjects";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardData = () => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Load data from different sources
  const { projects, isLoading: projectsLoading } = useProjectsData(lastUpdate);
  const { proposals, invoices, clients, isLoading: supabaseLoading } = useSupabaseData(lastUpdate);

  const isLoading = projectsLoading || supabaseLoading;

  // Calculate derived data
  const overviewStats = useOverviewStats(projects, invoices, proposals);
  const { revenueData, projectStatusData } = useChartData(projects, invoices);
  const recentProjects = useRecentProjects(projects);

  useEffect(() => {
    // Clear any synthetic data from localStorage for authenticated users
    const clearSyntheticData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === 'greenplanetlandscaping01@gmail.com') {
        console.log("Clearing ALL synthetic data for greenplanetlandscaping01@gmail.com");
        
        // Clear any localStorage items that might contain synthetic data
        const keysToRemove = [
          'landscape_projects',
          'projectsData',
          'financial_data',
          'dashboard_data',
          'demo_data',
          'synthetic_data',
          'mock_data',
          'fake_data',
          'sample_data',
          'test_data',
          'landscape_data',
          'demo_projects',
          'mock_projects',
          'sample_projects',
          'demo_invoices',
          'mock_invoices',
          'demo_proposals',
          'mock_proposals',
          'demo_clients',
          'mock_clients',
          'synthetic_financial_data',
          'demo_financial_data',
          'landscape_financial_data',
          'mock_financial_data'
        ];
        
        keysToRemove.forEach(key => {
          if (localStorage.getItem(key)) {
            console.log(`Removing synthetic data key: ${key}`);
            localStorage.removeItem(key);
          }
        });

        // Also clear any keys that might start with common prefixes
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('demo_') || 
              key.startsWith('mock_') || 
              key.startsWith('synthetic_') || 
              key.startsWith('sample_') || 
              key.startsWith('fake_') || 
              key.startsWith('test_') ||
              key.includes('landscape_') ||
              key.includes('synthetic') ||
              key.includes('demo') ||
              key.includes('mock')) {
            console.log(`Removing potential synthetic data key: ${key}`);
            localStorage.removeItem(key);
          }
        });
      }
    };

    clearSyntheticData();

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000); // Check for updates every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    overviewStats,
    revenueData,
    projectStatusData,
    recentProjects,
    proposals,
    invoices,
    clients,
    isLoading
  };
};
