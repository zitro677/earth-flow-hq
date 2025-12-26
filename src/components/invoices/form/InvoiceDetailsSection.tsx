
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { useInvoiceDetails } from "./hooks/useInvoiceDetails";

interface InvoiceDetailsSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const InvoiceDetailsSection: React.FC<InvoiceDetailsSectionProps> = ({
  form,
}) => {
  const { invoiceNumber, paymentTerms, selectedTerm, handlePaymentTermChange } = useInvoiceDetails(form);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium">Invoice #</span>
              <span className="font-mono">{invoiceNumber}</span>
            </div>
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Payment Terms</FormLabel>
              <Select 
                value={selectedTerm} 
                onValueChange={handlePaymentTermChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTerms.map((term) => (
                    <SelectItem key={term.value} value={term.value}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceDetailsSection;
