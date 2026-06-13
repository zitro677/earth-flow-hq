
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { proposalFormSchema } from "./formSchema";

type FormData = z.infer<typeof proposalFormSchema>;

interface ProposalDetailsSectionProps {
  form: UseFormReturn<FormData>;
  isEditMode?: boolean;
}

export const ProposalDetailsSection: React.FC<ProposalDetailsSectionProps> = ({ 
  form,
  isEditMode = false
}) => {
  // Ensure we have a stable status value
  const statusValue = isEditMode ? "Modo Edición" : "Borrador";
  const statusClass = isEditMode ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      layout // Add layout prop for smoother transitions
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detalles de la Propuesta</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium">Estado de la Propuesta</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${statusClass}`}>
                {statusValue}
              </span>
            </div>
            <FormField
              control={form.control}
              name="proposalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de la Propuesta</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expirationDate"
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
              <FormLabel>Estado</FormLabel>
              <Select defaultValue="Draft" disabled={isEditMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Borrador</SelectItem>
                  <SelectItem value="Sent">Enviada</SelectItem>
                  <SelectItem value="Approved">Aprobada</SelectItem>
                  <SelectItem value="Rejected">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
