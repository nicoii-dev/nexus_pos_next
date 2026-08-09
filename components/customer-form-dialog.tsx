"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormField } from "@/components/form-field";
import { UserPlus, Loader2 } from "lucide-react";
import { useCreateCustomer } from "@/services/customers";
import { useToast } from "@/hooks/use-toast";
import { customerSchema, type CustomerFormData } from "@/lib/validations/customer";
import type { Customer } from "@/types";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (customer: Customer) => void;
}

export function CustomerFormDialog({ open, onOpenChange, onSuccess }: CustomerFormDialogProps) {
  const createCustomer = useCreateCustomer();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { firstName: "", lastName: "", phone: "", address: "", remarks: "" },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const customer = await createCustomer.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.address ? { address: data.address } : {}),
        ...(data.remarks ? { remarks: data.remarks } : {}),
      });
      reset();
      onOpenChange(false);
      onSuccess?.(customer);
      toast({ title: "Customer created", description: `${customer.fullName} added to your customers.` });
    } catch {
      toast({ title: "Failed to create customer", description: "Unable to create the customer. Please try again.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md glass-card">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-primary" />
            New Customer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First name" error={errors.firstName?.message}>
                <Input className="rounded-[10px]" {...register("firstName")} placeholder="Maria" />
              </FormField>
              <FormField label="Last name" error={errors.lastName?.message}>
                <Input className="rounded-[10px]" {...register("lastName")} placeholder="Santos" />
              </FormField>
            </div>
            <FormField label="Phone" error={errors.phone?.message}>
              <Input className="rounded-[10px]" {...register("phone")} placeholder="+63 917 123 4567" />
            </FormField>
            <FormField label="Address" error={errors.address?.message}>
              <Input className="rounded-[10px]" {...register("address")} placeholder="123 Ayala Ave, Makati City" />
            </FormField>
            <FormField label="Remarks" error={errors.remarks?.message}>
              <Input className="rounded-[10px]" {...register("remarks")} placeholder="e.g. Regular customer" />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-[10px]" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="rounded-[10px] shadow-lg shadow-primary/15" disabled={createCustomer.isPending}>
              {createCustomer.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
