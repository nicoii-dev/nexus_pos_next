"use client";

import { useMemo, useState } from "react";
import { Banknote, CreditCard, Smartphone, ArrowLeftRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/form-field";
import { formatCurrency } from "@/lib/format";
import { useTransferPayment } from "@/services/paymentTransfers";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { PaymentType, Sale } from "@/types";

const PAYMENT_OPTIONS = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "digital", label: "Digital", icon: Smartphone },
] as const;

function getErrorMessage(error: unknown): string {
  const data = (error as { response?: { data?: { message?: string } } })?.response?.data;
  return data?.message ?? "Something went wrong. Please try again.";
}

interface PaymentTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sales: Sale[];
  onSuccess?: () => void;
}

export function PaymentTransferDialog({ open, onOpenChange, sales, onSuccess }: PaymentTransferDialogProps) {
  const transferPayment = useTransferPayment();
  const { toast } = useToast();
  const isBulk = sales.length > 1;
  const single = sales[0];

  const [toPaymentType, setToPaymentType] = useState<PaymentType | "">("");
  const [amount, setAmount] = useState(
    !isBulk && single ? String(single.total) : ""
  );
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fromPaymentType = isBulk ? null : single?.paymentMethod ?? null;

  const bulkAmount = useMemo(() => {
    if (!isBulk || !toPaymentType) return 0;
    return sales
      .filter((s) => s.paymentMethod !== toPaymentType)
      .reduce((sum, s) => sum + s.total, 0);
  }, [isBulk, sales, toPaymentType]);

  const canSubmit = submitting
    ? false
    : !!toPaymentType &&
      (isBulk
        ? sales.some((s) => s.paymentMethod !== toPaymentType)
        : !!fromPaymentType && fromPaymentType !== toPaymentType && Number(amount) > 0 && Number(amount) <= single.total);

  const handleSubmit = async () => {
    if (!toPaymentType) return;

    const transfers = isBulk
      ? sales
          .filter((s) => s.paymentMethod !== toPaymentType)
          .map((s) => ({
            saleId: s.id,
            fromPaymentType: s.paymentMethod,
            toPaymentType: toPaymentType as PaymentType,
            amount: s.total,
            reason: reason.trim() || undefined,
          }))
      : [
          {
            saleId: single.id,
            fromPaymentType: single.paymentMethod,
            toPaymentType: toPaymentType as PaymentType,
            amount: Number(amount),
            reason: reason.trim() || undefined,
          },
        ];

    if (transfers.length === 0) return;

    setSubmitting(true);
    try {
      const results = await Promise.allSettled(
        transfers.map((t) => transferPayment.mutateAsync(t))
      );
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (failed > 0) {
        const firstError = results.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
        toast({
          title: "Transfer incomplete",
          description: `${succeeded} succeeded, ${failed} failed. ${firstError ? getErrorMessage(firstError.reason) : ""}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: isBulk ? "Bulk transfer complete" : "Payment transferred",
        description: isBulk
          ? `${succeeded} sale(s) moved to ${PAYMENT_OPTIONS.find((p) => p.value === toPaymentType)?.label.toLowerCase()}.`
          : `${formatCurrency(Number(amount))} moved to ${PAYMENT_OPTIONS.find((p) => p.value === toPaymentType)?.label.toLowerCase()}.`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast({
        title: "Transfer failed",
        description: "Unable to process the payment transfer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg glass-card">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isBulk ? "Bulk Payment Transfer" : "Transfer Payment"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isBulk ? (
            <div className="rounded-[10px] border bg-muted/40 p-3">
              <p className="mb-2 text-sm font-medium">
                Transfer {sales.length} selected sale(s)
              </p>
              <div className="max-h-36 space-y-1 overflow-y-auto text-sm">
                {sales.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-xs">{s.transactionNumber}</span>
                    <span className="flex items-center gap-1.5 capitalize">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs capitalize",
                          s.paymentMethod === "cash"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : s.paymentMethod === "card"
                              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                              : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        )}
                      >
                        {s.paymentMethod}
                      </span>
                      <span className="font-medium tabular-nums">{formatCurrency(s.total)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            single && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Transaction #</span>
                  <p className="font-mono font-medium">{single.transactionNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total</span>
                  <p className="font-medium">{formatCurrency(single.total)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Current Payment</span>
                  <p className="flex items-center gap-2 font-medium capitalize">
                    {fromPaymentType && (
                      <>
                        {(() => {
                          const option = PAYMENT_OPTIONS.find((p) => p.value === fromPaymentType);
                          const Icon = option?.icon ?? Banknote;
                          return <Icon className="h-4 w-4 text-muted-foreground" />;
                        })()}
                        {fromPaymentType}
                      </>
                    )}
                  </p>
                </div>
              </div>
            )
          )}

          <Separator />

          <FormField label="Transfer To">
            <Select value={toPaymentType} onValueChange={(v) => { if (v !== null) setToPaymentType(v as PaymentType); }}>
              <SelectTrigger className="w-full rounded-[10px]">
                <SelectValue placeholder="Select destination payment type" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const disabled = isBulk
                    ? false
                    : !!fromPaymentType && fromPaymentType === option.value;
                  return (
                    <SelectItem key={option.value} value={option.value} disabled={disabled}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormField>

          {isBulk ? (
            <div className="flex items-center justify-between rounded-[10px] border bg-muted/40 px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <ArrowLeftRight className="h-4 w-4" />
                Total to transfer
              </span>
              <span className="font-semibold tabular-nums">{formatCurrency(bulkAmount)}</span>
            </div>
          ) : (
            <FormField label="Amount">
              <Input
                type="number"
                min={0.01}
                step={0.01}
                max={single?.total}
                className="rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter transfer amount"
              />
              {single && Number(amount) > single.total && (
                <p className="text-sm text-destructive">Amount exceeds sale total ({formatCurrency(single.total)}).</p>
              )}
            </FormField>
          )}

          <FormField label="Reason (optional)">
            <Input
              className="rounded-[10px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isBulk ? "e.g. Bulk payment adjustment" : "e.g. Payment adjustment"}
            />
          </FormField>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-[10px]" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button className="rounded-[10px] shadow-lg shadow-primary/15" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              <>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                {isBulk ? "Transfer Selected" : "Transfer Payment"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
