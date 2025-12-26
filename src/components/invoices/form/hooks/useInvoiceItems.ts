
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export const useInvoiceItems = (form: UseFormReturn<any>) => {
  const [items, setItems] = useState<Array<any>>(form.getValues("items") || []);

  // Update items when form items change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.items) {
        setItems(value.items);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const addItem = () => {
    const updatedItems = [
      ...form.getValues("items"),
      { description: "", quantity: 1, unitPrice: 0 },
    ];
    form.setValue("items", updatedItems);
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      const updatedItems = currentItems.filter((_, i) => i !== index);
      form.setValue("items", updatedItems);
      setItems(updatedItems);
    }
  };

  return { items, addItem, removeItem, setItems };
};
