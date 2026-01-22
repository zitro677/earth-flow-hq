
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  navigateBack: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  isEditMode,
  navigateBack
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={navigateBack}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="min-w-[150px]"
      >
        {isSubmitting 
          ? (isEditMode ? "Actualizando..." : "Creando...") 
          : (isEditMode ? "Actualizar Proyecto" : "Crear Proyecto")}
      </Button>
    </div>
  );
};

export default FormActions;
