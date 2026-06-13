
import React from "react";
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ClientSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  clients: any[];
  handleClientChange: (clientId: string) => Promise<void>;
  isLoading: boolean;
}

const ClientSection: React.FC<ClientSectionProps> = ({
  form,
  clients,
  handleClientChange,
  isLoading,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Información del Cliente</h3>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => navigate("/clients/new")}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Nuevo Cliente
            </Button>
          </div>

          <div className="mb-4">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar Cliente</FormLabel>
                  <Select
                    onValueChange={handleClientChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white z-50">
                      {clients.length === 0 ? (
                        <div className="p-2 text-center text-gray-500">
                          <p>No hay clientes disponibles</p>
                          <p className="text-sm mt-1">Por favor agrega un cliente primero</p>
                        </div>
                      ) : (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa la dirección del cliente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientSection;
