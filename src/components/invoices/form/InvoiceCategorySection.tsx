import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formSchema } from "./formSchema";

interface InvoiceCategorySectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const InvoiceCategorySection: React.FC<InvoiceCategorySectionProps> = ({ form }) => {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Categoría de Factura</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value || "aliaddo"}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2"
                >
                  <label className="flex min-h-24 cursor-pointer items-start gap-3 rounded-md border bg-background p-4 transition-colors hover:bg-accent">
                    <RadioGroupItem value="aliaddo" id="invoice-category-aliaddo" className="mt-1" />
                    <span className="space-y-1">
                      <span className="block font-semibold">Aliaddo / Factura electrónica DIAN</span>
                      <span className="block text-sm text-muted-foreground">Se calcula IVA del 19%.</span>
                    </span>
                  </label>

                  <label className="flex min-h-24 cursor-pointer items-start gap-3 rounded-md border bg-background p-4 transition-colors hover:bg-accent">
                    <RadioGroupItem value="efectivo" id="invoice-category-efectivo" className="mt-1" />
                    <span className="space-y-1">
                      <span className="block font-semibold">Efectivo</span>
                      <span className="block text-sm text-muted-foreground">No se calcula IVA.</span>
                    </span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default InvoiceCategorySection;