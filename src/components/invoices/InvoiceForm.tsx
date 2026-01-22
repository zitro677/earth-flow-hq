
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useInvoiceForm } from "./form/useInvoiceForm";
import ClientSection from "./form/ClientSection";
import InvoiceDetailsSection from "./form/InvoiceDetailsSection";
import SummarySection from "./form/SummarySection";
import InvoiceItemsSection from "./form/InvoiceItemsSection";
import NotesSection from "./form/NotesSection";
import AuthErrorAlert from "./form/AuthErrorAlert";
import { toast } from "sonner";

const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const {
    form,
    clients,
    isLoading,
    authError,
    items,
    subtotal,
    tax,
    total,
    handleClientChange,
    onSubmit,
    addItem,
    removeItem,
    loadInvoiceData,
  } = useInvoiceForm(id);
  
  // Load invoice data when editing
  useEffect(() => {
    if (isEditMode && id) {
      loadInvoiceData(id);
    }
  }, [isEditMode, id, loadInvoiceData]);

  if (authError) {
    return <AuthErrorAlert show={authError} />;
  }

  const handleFormSubmit = async (data: any) => {
    if (!data.client_id || data.client_id === "") {
      toast.error("Por favor selecciona un cliente");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Por favor agrega al menos un ítem");
      return;
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/invoices")}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Facturas
          </Button>
          <h1 className="text-2xl font-semibold">
            {isEditMode ? "Editar Factura" : "Crear Nueva Factura"}
          </h1>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Restablecer
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditMode ? "Actualizar Factura" : "Guardar Factura"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ClientSection 
            form={form} 
            clients={clients} 
            handleClientChange={handleClientChange} 
            isLoading={isLoading} 
          />
          <InvoiceDetailsSection form={form} />
          <SummarySection subtotal={subtotal} tax={tax} total={total} />
        </div>

        <InvoiceItemsSection 
          form={form} 
          items={items} 
          addItem={addItem} 
          removeItem={removeItem} 
        />

        <NotesSection form={form} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/invoices")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : isEditMode ? "Actualizar Factura" : "Guardar Factura"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
