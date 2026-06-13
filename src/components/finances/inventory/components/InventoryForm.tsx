
import React from "react";
import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryFormProps {
  selectedItem?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
  selectedItem,
  onSubmit,
  onCancel,
}) => {
  const form = useForm({
    defaultValues: selectedItem || {
      name: "",
      category: "",
      quantity: "1",
      unit_cost: "",
      life_span: "",
      depreciation_rate: "",
      status: "active",
    },
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {selectedItem ? "Editar Artículo de Inventario" : "Agregar Artículo de Inventario"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ingrese el nombre del artículo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="machinery">Maquinaria</SelectItem>
                    <SelectItem value="tools">Herramientas</SelectItem>
                    <SelectItem value="appliances">Equipos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="unit_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo Unitario</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="life_span"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vida Útil (años)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depreciation_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa de Depreciación (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" max="100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedItem ? "Actualizar" : "Agregar"} Artículo
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
