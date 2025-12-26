
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortOrder?: string;
  setSortOrder?: (value: string) => void;
  sortBy?: string;
  setSortBy?: (value: string) => void;
  direction?: string;
  setDirection?: (value: string) => void;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  sortBy,
  setSortBy,
  direction,
  setDirection,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="py-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {setSortOrder && (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <Select
              value={sortOrder || "newest"}
              onValueChange={setSortOrder}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {setSortBy && (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <Select
              value={sortBy || "date"}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {setDirection && (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Direction</label>
            <Select
              value={direction || "desc"}
              onValueChange={setDirection}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceFilters;
