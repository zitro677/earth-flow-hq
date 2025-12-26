
export const exportToCSV = (expenses: any[]) => {
  // Define CSV headers
  const headers = ['ID', 'Date', 'Category', 'Vendor', 'Description', 'Amount', 'Deductible'];
  
  // Convert expenses to CSV format
  const csvData = expenses.map(expense => [
    expense.id,
    expense.date,
    expense.category,
    expense.vendor,
    expense.description,
    expense.amount.toFixed(2),
    expense.deductible ? 'Yes' : 'No'
  ]);

  // Combine headers and data
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
