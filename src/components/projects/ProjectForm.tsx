
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import AnimatedPage from "../shared/AnimatedPage";
import { useProjectForm } from "./hooks/useProjectForm";
import ProjectInfoCard from "./form/ProjectInfoCard";
import TimelineBudgetCard from "./form/TimelineBudgetCard";
import DescriptionCard from "./form/DescriptionCard";
import ProjectFormHeader from "./form/ProjectFormHeader";
import FormActions from "./form/FormActions";

const ProjectForm: React.FC = () => {
  const {
    form,
    isSubmitting,
    isEditMode,
    loading,
    statusOptions,
    onSubmit,
    navigate
  } = useProjectForm();

  if (loading) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Loading Project...</h1>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
        <ProjectFormHeader 
          isEditMode={isEditMode} 
          navigateBack={() => navigate("/projects")} 
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectInfoCard form={form} statusOptions={statusOptions} />
              <TimelineBudgetCard form={form} />
            </div>

            <DescriptionCard form={form} />

            <FormActions 
              isSubmitting={isSubmitting}
              isEditMode={isEditMode}
              navigateBack={() => navigate("/projects")}
            />
          </form>
        </Form>
      </div>
    </AnimatedPage>
  );
};

export default ProjectForm;
