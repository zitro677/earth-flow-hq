
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString();
};

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateProgress = (project: any): number => {
  // Simple progress calculation based on status
  switch (project?.status) {
    case 'Planning':
      return 10;
    case 'In Progress':
      return 50;
    case 'Completed':
      return 100;
    case 'On Hold':
      return 25;
    default:
      return 0;
  }
};

export const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Planning": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "On Hold": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
  };
  return colorMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
};
