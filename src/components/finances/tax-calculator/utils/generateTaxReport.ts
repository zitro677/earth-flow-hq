
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TaxExpenses, TaxResults } from "../hooks/useTaxCalculator";

interface GenerateTaxReportProps {
  taxResults: TaxResults;
  expenses: TaxExpenses;
  income: number;
  filingStatus: string;
  year: string;
}

export const generateTaxReport = ({
  taxResults,
  expenses,
  income,
  filingStatus,
  year,
}: GenerateTaxReportProps) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Header
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text(`Tax Report ${year}`, pageWidth / 2, 20, { align: "center" });
  
  // Filing Info Section
  doc.setFontSize(14);
  doc.text("Filing Information", 14, 35);
  
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99);
  doc.text(`Annual Income: ${formatCurrency(income)}`, 14, 45);
  
  const filingStatusText = filingStatus
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  doc.text(`Filing Status: ${filingStatusText}`, 14, 52);
  doc.text(`Tax Year: ${year}`, 14, 59);
  
  // Tax Results Section
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Tax Calculation Results", 14, 75);
  
  // Results table
  const taxResultsData = [
    ["Total Income", formatCurrency(taxResults.totalIncome)],
    ["Total Deductions", formatCurrency(taxResults.totalDeductions)],
    ["Taxable Income", formatCurrency(taxResults.taxableIncome)],
    ["Estimated Tax", formatCurrency(taxResults.estimatedTax)],
    ["Effective Tax Rate", `${taxResults.effectiveTaxRate.toFixed(1)}%`],
    ["After-Tax Income", formatCurrency(taxResults.totalIncome - taxResults.estimatedTax)]
  ];
  
  autoTable(doc, {
    startY: 80,
    head: [["Item", "Amount"]],
    body: taxResultsData,
    theme: 'striped',
    headStyles: { fillColor: [45, 55, 72] },
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 80 } }
  });
  
  // Expense Breakdown Section
  const expenseY = doc.lastAutoTable?.finalY || 150;
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Business Expenses Breakdown", 14, expenseY + 15);
  
  // Expenses table
  const expensesData = Object.entries(expenses).map(([category, value]) => [
    category.charAt(0).toUpperCase() + category.slice(1),
    formatCurrency(value)
  ]);
  
  autoTable(doc, {
    startY: expenseY + 20,
    head: [["Category", "Amount"]],
    body: expensesData,
    theme: 'striped',
    headStyles: { fillColor: [45, 55, 72] },
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 80 } }
  });
  
  // Footer
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${date}`, pageWidth / 2, 285, { align: "center" });
  
  // Save the PDF
  doc.save(`tax_report_${year}.pdf`);
};
