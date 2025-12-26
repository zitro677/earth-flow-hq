
export interface Invoice {
  id: string;
  client: string;
  date: string;
  dueDate: string;
  amount: string;
  status: string;
}

// Mock data
export const mockInvoices: Invoice[] = [
  {
    id: "INV-2023-001",
    client: "Johnson Family",
    date: "2023-10-15",
    dueDate: "2023-11-15",
    amount: "$2,450.00",
    status: "Paid",
  },
  {
    id: "INV-2023-002",
    client: "Oakridge Community Center",
    date: "2023-11-01",
    dueDate: "2023-12-01",
    amount: "$8,750.00",
    status: "Pending",
  },
  {
    id: "INV-2023-003",
    client: "Peterson Residence",
    date: "2023-11-10",
    dueDate: "2023-12-10",
    amount: "$3,200.00",
    status: "Pending",
  },
  {
    id: "INV-2023-004",
    client: "Sunset Hills Park",
    date: "2023-10-05",
    dueDate: "2023-11-05",
    amount: "$12,300.00",
    status: "Overdue",
  },
  {
    id: "INV-2023-005",
    client: "Martinez Garden",
    date: "2023-11-20",
    dueDate: "2023-12-20",
    amount: "$4,750.00",
    status: "Pending",
  },
];

export const filterInvoicesByStatus = (invoices: Invoice[], statusFilter: string): Invoice[] => {
  if (statusFilter === "all") return invoices;
  return invoices.filter(
    (invoice) => invoice.status.toLowerCase() === statusFilter.toLowerCase()
  );
};

export const sortInvoicesByDate = (invoices: Invoice[], sortOrder: string): Invoice[] => {
  return [...invoices].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
};

export const calculateTotalAmount = (invoices: Invoice[]): number => {
  return invoices.reduce(
    (sum, invoice) => sum + parseFloat(invoice.amount.replace("$", "").replace(",", "")),
    0
  );
};

export const calculatePendingAmount = (invoices: Invoice[]): number => {
  return invoices
    .filter((invoice) => invoice.status === "Pending" || invoice.status === "Overdue")
    .reduce(
      (sum, invoice) => sum + parseFloat(invoice.amount.replace("$", "").replace(",", "")),
      0
    );
};

export const getPendingInvoicesCount = (invoices: Invoice[]): number => {
  return invoices.filter(
    (invoice) => invoice.status === "Pending" || invoice.status === "Overdue"
  ).length;
};
