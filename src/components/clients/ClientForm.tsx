import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedPage from "../shared/AnimatedPage";
import { useSingleClient } from "./hooks/useSingleClient";
import { useClientMutations } from "./hooks/useClientMutations";
import { NewClientData } from "./types";

// Schema now ensures name is required
const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { fetchClient } = useSingleClient();
  const { useCreateClient, useUpdateClient } = useClientMutations();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Load client data when editing
  useEffect(() => {
    if (isEditing && id) {
      const loadClient = async () => {
        try {
          const client = await fetchClient(id);
          form.reset({
            name: client.name,
            email: client.email || "",
            phone: client.phone || "",
            address: client.address || "",
          });
        } catch (error) {
          console.error("Error loading client:", error);
          navigate("/clients");
        }
      };

      loadClient();
    }
  }, [isEditing, id, fetchClient, form, navigate]);

  const onSubmit = async (data: ClientFormValues) => {
    try {
      // Ensure name is provided (already validated by zod)
      const clientData: NewClientData = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
      };

      if (isEditing && id) {
        await updateClient.mutateAsync({
          id,
          ...clientData,
        });
      } else {
        await createClient.mutateAsync(clientData);
      }
      navigate("/clients");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <AnimatedPage>
      <div className="page-container max-w-3xl mx-auto">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/clients")}
          className="flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Clients
        </Button>

        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6">
              {isEditing ? "Edit Client" : "Add New Client"}
            </h1>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client name" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="client@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Client address"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/clients")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Update Client" : "Create Client"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ClientForm;
