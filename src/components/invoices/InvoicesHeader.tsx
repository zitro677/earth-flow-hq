
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InvoicesHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Facturas</h1>
        <p className="text-muted-foreground mt-1">
          Administra y da seguimiento a las facturas de tus clientes
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-4 md:mt-0"
      >
        <Button
          onClick={() => navigate("/invoices/new")}
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" /> Crear Factura
        </Button>
      </motion.div>
    </div>
  );
};

export default InvoicesHeader;
