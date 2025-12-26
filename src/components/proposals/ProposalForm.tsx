
import React from "react";
import { Form } from "@/components/ui/form";
import { ClientInfoSection } from "./form/ClientInfoSection";
import { ProposalDetailsSection } from "./form/ProposalDetailsSection";
import { SummarySection } from "./form/SummarySection";
import { ProjectScopeSection } from "./form/ProjectScopeSection";
import { TimelineSection } from "./form/TimelineSection";
import { ItemsSection } from "./form/ItemsSection";
import { NotesSection } from "./form/NotesSection";
import { ProposalFormActions } from "./form/ProposalFormActions";
import { useProposalForm } from "./form/useProposalForm";
import { Skeleton } from "@/components/ui/skeleton";

const ProposalForm: React.FC = () => {
  const { 
    form, 
    items, 
    subtotal, 
    tax, 
    total, 
    addItem, 
    removeItem, 
    onSubmit,
    isPending,
    isEditMode,
    isLoading
  } = useProposalForm();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProposalFormActions 
          form={form} 
          isPending={isPending} 
          position="top" 
          isEditMode={isEditMode} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Information */}
          <ClientInfoSection form={form} />

          {/* Proposal Details */}
          <ProposalDetailsSection form={form} isEditMode={isEditMode} />

          {/* Summary */}
          <SummarySection 
            subtotal={subtotal} 
            tax={tax} 
            total={total} 
          />
        </div>

        {/* Project Scope */}
        <ProjectScopeSection form={form} />

        {/* Timeline */}
        <TimelineSection form={form} />

        {/* Line Items */}
        <ItemsSection 
          form={form} 
          items={items} 
          addItem={addItem} 
          removeItem={removeItem} 
        />

        {/* Terms & Notes */}
        <NotesSection form={form} />

        <ProposalFormActions 
          form={form} 
          isPending={isPending} 
          position="bottom" 
          isEditMode={isEditMode} 
        />
      </form>
    </Form>
  );
};

export default ProposalForm;
