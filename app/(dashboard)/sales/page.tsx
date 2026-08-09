"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { PaymentTransferDialog } from "@/components/payment-transfer-dialog";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Eye, Printer, RotateCcw, ChevronLeft, ChevronRight, Download, ArrowLeftRight, X, Banknote, CreditCard, Smartphone, BookUser } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetSales, useGetSalesSummary } from "@/services/sales";
import type { Sale } from "@/types";

const PAGE_SIZE = 10;

const PAYMENT_SUMMARY_OPTIONS = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "digital", label: "Digital", icon: Smartphone },
  { value: "credit", label: "Credit", icon: BookUser },
] as const;

export default function SalesPage() {
  const { data: sales = [], isLoading } = useGetSales();
  const { data: paymentSummary } = useGetSalesSummary();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [transferTargets, setTransferTargets] = useState<Sale[]>([]);
  const [transferOpen, setTransferOpen] = useState(false);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      if (search && !s.transactionNumber.toLowerCase().includes(search.toLowerCase()) && !s.cashier.toLowerCase().includes(search.toLowerCase()) && !(s.customer?.fullName ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (paymentFilter !== "all" && s.paymentMethod !== paymentFilter) return false;
      return true;
    });
  }, [sales, search, statusFilter, paymentFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageAllSelected = paginated.length > 0 && paginated.every((s) => selectedIds.includes(s.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectPage = () => {
    setSelectedIds((prev) => {
      const pageIds = paginated.map((s) => s.id);
      if (pageIds.every((id) => prev.includes(id))) {
        return prev.filter((id) => !pageIds.includes(id));
      }
      return [...prev, ...pageIds.filter((id) => !prev.includes(id))];
    });
  };

  const clearSelection = () => setSelectedIds([]);

  const openTransfer = (sale: Sale) => {
    setTransferTargets([sale]);
    setTransferOpen(true);
  };

  const openBulkTransfer = () => {
    const targets = sales.filter((s) => selectedIds.includes(s.id));
    if (targets.length === 0) return;
    setTransferTargets(targets);
    setTransferOpen(true);
  };

  const exportSelected = () => {
    const selected = sales.filter((s) => selectedIds.includes(s.id));
    if (selected.length === 0) return;

    const headers = ["Transaction #", "Cashier", "Items", "Total", "Total Cost", "Profit", "Payment", "Status", "Date"];
    const rows = selected.map((s) => [
      s.transactionNumber,
      s.cashier,
      s.items.length,
      s.total,
      s.totalCost,
      s.total - s.totalCost,
      s.paymentMethod,
      s.status,
      s.date,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selected-sales.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Sales" description="View all transactions" />

      <div className="flex flex-wrap items-center gap-3 rounded-[10px] border bg-card/60 glass p-3 shadow-float">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transaction or cashier..." className="pl-9 rounded-[10px]" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { if (v !== null) { setStatusFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-[160px] rounded-[10px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={(v) => { if (v !== null) { setPaymentFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-[180px] rounded-[10px]"><SelectValue placeholder="All Payments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="rounded-[10px]"><Download className="mr-2 h-4 w-4" />Export</Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PAYMENT_SUMMARY_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <div key={option.value} className="flex items-center justify-between rounded-[10px] border bg-card/60 glass px-4 py-3 shadow-float">
              <span className="flex items-center gap-2 text-sm capitalize text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {option.label}
              </span>
              <span className="font-semibold tabular-nums">{formatCurrency(paymentSummary?.[option.value] ?? 0)}</span>
            </div>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-primary/30 bg-primary/5 p-3 shadow-float">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">
              <span className="font-semibold text-primary">{selectedIds.length}</span> sale{selectedIds.length === 1 ? "" : "s"} selected
            </p>
            <Button variant="ghost" size="sm" className="rounded-[10px] text-muted-foreground" onClick={clearSelection}>
              <X className="mr-1.5 h-4 w-4" />Clear
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-[10px]" onClick={exportSelected}>
              <Download className="mr-2 h-4 w-4" />Export Selected
            </Button>
            <Button size="sm" className="rounded-[10px] shadow-lg shadow-primary/15" onClick={openBulkTransfer}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />Transfer Payment
            </Button>
          </div>
        </div>
      )}

      {paginated.length === 0 ? (
        <EmptyState title="No transactions found" description="Try adjusting your filters" />
      ) : (
        <div className="rounded-[10px] border bg-card shadow-float overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all on page"
                    className="h-4 w-4 cursor-pointer rounded-[4px] accent-primary"
                    checked={pageAllSelected}
                    onChange={toggleSelectPage}
                  />
                </TableHead>
                <TableHead>Transaction #</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Transfers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((s) => (
                <TableRow key={s.id} className={selectedIds.includes(s.id) ? "bg-primary/5" : undefined}>
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Select ${s.transactionNumber}`}
                      className="h-4 w-4 cursor-pointer rounded-[4px] accent-primary"
                      checked={selectedIds.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">{s.transactionNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p>{s.cashier}</p>
                      {s.customer && <p className="text-xs text-muted-foreground">{s.customer.fullName}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{s.items.length}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(s.total)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(s.totalCost)}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(s.total - s.totalCost)}</TableCell>
                  <TableCell>
                    <span className={cn("capitalize text-sm", s.paymentMethod === "credit" && "font-medium text-primary")}>{s.paymentMethod}</span>
                  </TableCell>
                  <TableCell>
                    {s.transfers && s.transfers.length > 0 ? (
                      <div className="flex flex-col items-start gap-1">
                        {s.transfers.slice(0, 2).map((t) => (
                          <Badge
                            key={t.id}
                            variant="secondary"
                            className="rounded-full font-normal capitalize"
                            title={formatDateTime(t.createdAt)}
                          >
                            {t.fromPaymentType}
                            <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                            {t.toPaymentType}
                            <span className="tabular-nums text-muted-foreground">{formatCurrency(t.amount)}</span>
                          </Badge>
                        ))}
                        {s.transfers.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{s.transfers.length - 2} more</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(s.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[10px]" onClick={() => setViewingSale(s)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[10px]" onClick={() => openTransfer(s)} title="Transfer payment"><ArrowLeftRight className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[10px]"><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[10px]"><RotateCcw className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
            <p className="text-sm text-muted-foreground">Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-[10px]" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="rounded-[10px]" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!viewingSale} onOpenChange={() => setViewingSale(null)}>
        <DialogContent className="max-w-lg glass-card">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <DialogHeader>
            <DialogTitle className="text-xl">Transaction Details</DialogTitle>
          </DialogHeader>
          {viewingSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Transaction #</span><p className="font-mono font-medium">{viewingSale.transactionNumber}</p></div>
                <div><span className="text-muted-foreground">Cashier</span><p className="font-medium">{viewingSale.cashier}</p></div>
                <div><span className="text-muted-foreground">Payment</span><p className="capitalize">{viewingSale.paymentMethod}</p></div>
                <div><span className="text-muted-foreground">Status</span><div><StatusBadge status={viewingSale.status} /></div></div>
                <div><span className="text-muted-foreground">Date</span><p>{formatDateTime(viewingSale.date)}</p></div>
                {viewingSale.customer && <div><span className="text-muted-foreground">Customer</span><p className="font-medium">{viewingSale.customer.fullName}</p></div>}
              </div>
              <Separator />
              <div>
                <p className="mb-2 text-sm font-medium">Items</p>
                {viewingSale.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span>{item.productName} x{item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.itemTotal)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(viewingSale.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{formatCurrency(viewingSale.discount)}</span></div>
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span className="text-gradient">{formatCurrency(viewingSale.total)}</span></div>
              </div>
              {viewingSale.transfers && viewingSale.transfers.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                      <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                      Payment Transfers
                    </p>
                    <div className="space-y-1.5">
                      {viewingSale.transfers.map((t) => (
                        <div key={t.id} className="flex items-center justify-between rounded-[10px] border bg-muted/40 px-3 py-2 text-sm">
                          <span className="text-xs capitalize text-muted-foreground">
                            {t.fromPaymentType} <ArrowLeftRight className="mx-1 inline h-3 w-3" /> {t.toPaymentType}
                          </span>
                          <span className="font-medium">{formatCurrency(t.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <DialogFooter className="gap-2">
                <Button variant="outline" className="rounded-[10px]" onClick={() => setViewingSale(null)}>Close</Button>
                <Button variant="outline" className="rounded-[10px]"><Printer className="mr-2 h-4 w-4" />Print Receipt</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {transferTargets.length > 0 && (
        <PaymentTransferDialog
          open={transferOpen}
          onOpenChange={setTransferOpen}
          sales={transferTargets}
          onSuccess={clearSelection}
        />
      )}
    </div>
  );
}
