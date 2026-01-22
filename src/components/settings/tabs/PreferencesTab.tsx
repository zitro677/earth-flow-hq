
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UserSettings } from "../types";

interface PreferencesTabProps {
  initialSettings: UserSettings;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const PreferencesTab = ({ initialSettings, onSave, isLoading }: PreferencesTabProps) => {
  const preferencesForm = useForm({
    defaultValues: {
      darkMode: initialSettings.darkMode,
      compactView: initialSettings.compactView,
      defaultDashboard: initialSettings.defaultDashboard || "overview",
      emailDigest: true
    }
  });

  return (
    <div className="space-y-4">
      <Form {...preferencesForm}>
        <form onSubmit={preferencesForm.handleSubmit(onSave)}>
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Visualización</CardTitle>
              <CardDescription>
                Personaliza la apariencia de tu panel de control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={preferencesForm.control}
                name="darkMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Modo Oscuro</FormLabel>
                      <FormDescription>
                        Activa el modo oscuro para reducir la fatiga visual en ambientes con poca luz
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={preferencesForm.control}
                name="compactView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Vista Compacta</FormLabel>
                      <FormDescription>
                        Muestra más contenido por página con un diseño compacto
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Preferencias'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      <Card>
        <CardHeader>
          <CardTitle>Vistas Predeterminadas</CardTitle>
          <CardDescription>
            Configura tus vistas predeterminadas para proyectos y facturas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="default-dashboard">Vista de Panel Predeterminada</Label>
            <select 
              id="default-dashboard"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="overview"
            >
              <option value="overview">Resumen</option>
              <option value="projects">Proyectos</option>
              <option value="finances">Finanzas</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="default-project-view">Vista de Proyecto Predeterminada</Label>
            <select 
              id="default-project-view"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="grid"
            >
              <option value="grid">Cuadrícula</option>
              <option value="list">Lista</option>
              <option value="kanban">Kanban</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={() => toast.success("Vistas predeterminadas actualizadas exitosamente")}
          >
            Guardar Configuración de Vistas
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PreferencesTab;
