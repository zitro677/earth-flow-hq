
import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { proposalFormSchema } from "./formSchema";

type FormData = z.infer<typeof proposalFormSchema>;

interface ProjectScopeSectionProps {
  form: UseFormReturn<FormData>;
}

export const ProjectScopeSection: React.FC<ProjectScopeSectionProps> = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Scope</h3>
          <FormField
            control={form.control}
            name="scope"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Describe the scope of the project in detail..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
