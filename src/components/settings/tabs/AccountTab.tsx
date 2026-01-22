
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserSettings } from "../types";

interface AccountTabProps {
  initialSettings: UserSettings;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const AccountTab = ({ initialSettings, onSave, isLoading }: AccountTabProps) => {
  const { user } = useAuth();

  const accountForm = useForm({
    defaultValues: {
      name: initialSettings.name,
      email: initialSettings.email || user?.email || "usuario@ejemplo.com",
      company: initialSettings.company,
      bio: initialSettings.bio
    }
  });

  return (
    <div className="space-y-4">
      <Form {...accountForm}>
        <form onSubmit={accountForm.handleSubmit(onSave)}>
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza los detalles de tu cuenta e información personal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted/50" />
                    </FormControl>
                    <FormDescription>
                      Tu correo electrónico se usa para iniciar sesión y no puede ser cambiado.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ingresa tu nombre completo" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ingresa el nombre de tu empresa" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Escribe una breve biografía sobre ti" 
                        className="resize-none min-h-[120px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      <Card>
        <CardHeader>
          <CardTitle>Contraseña</CardTitle>
          <CardDescription>
            Actualiza tu contraseña y configuración de seguridad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={() => toast.success("Contraseña actualizada exitosamente")}
          >
            Actualizar Contraseña
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountTab;
