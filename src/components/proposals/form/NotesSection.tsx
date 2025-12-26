
import React from "react";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { proposalFormSchema } from "./formSchema";

type FormData = z.infer<typeof proposalFormSchema>;

interface NotesSectionProps {
  form: UseFormReturn<FormData>;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Terms & Notes</h3>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Add terms, conditions, and any additional notes..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
