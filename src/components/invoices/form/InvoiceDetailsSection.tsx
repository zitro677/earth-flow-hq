
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
          <h3 className="text-lg font-semibold mb-4">Detalles de Factura</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría de Factura</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 gap-2"
                    >
                      <label className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="aliaddo" id="cat-aliaddo" className="mt-0.5" />
                        <div>
                          <div className="font-medium">Aliaddo (FE DIAN)</div>
                          <div className="text-xs text-muted-foreground">Factura electrónica con IVA 19%</div>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="efectivo" id="cat-efectivo" className="mt-0.5" />
                        <div>
                          <div className="font-medium">Efectivo</div>
                          <div className="text-xs text-muted-foreground">Sin IVA</div>
                        </div>
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium">Factura #</span>
              <span className="font-mono">{invoiceNumber}</span>
            </div>
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Factura</FormLabel>
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
                  <FormLabel>Fecha de Vencimiento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Términos de Pago</FormLabel>
              <Select 
                value={selectedTerm} 
                onValueChange={handlePaymentTermChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar términos" />
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
