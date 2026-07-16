"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Eye, Printer, RotateCcw, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { getSales } from "@/services/sales";
import type { Sale } from "@/types";

const PAGE_SIZE = 10;

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  useEffect(() => {
    getSales().then((s) => { setSales(s); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      if (search && !s.transactionNumber.toLowerCase().includes(search.toLowerCase()) && !s.cashier.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (paymentFilter !== "all" && s.paymentMethod !== paymentFilter) return false;
      return true;
    });
  }, [sales, search, statusFilter, paymentFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Sales" description="View all transactions" />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transaction or cashier..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { if (v !== null) { setStatusFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={(v) => { if (v !== null) { setPaymentFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Payments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
      </div>

      {paginated.length === 0 ? (
        <EmptyState title="No transactions found" description="Try adjusting your filters" />
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction #</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm font-medium">{s.transactionNumber}</TableCell>
                  <TableCell>{s.cashier}</TableCell>
                  <TableCell className="text-right">{s.items.length}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(s.total)}</TableCell>
                  <TableCell className="capitalize text-sm">{s.paymentMethod}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(s.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingSale(s)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><RotateCcw className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!viewingSale} onOpenChange={() => setViewingSale(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {viewingSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Transaction #</span><p className="font-mono font-medium">{viewingSale.transactionNumber}</p></div>
                <div><span className="text-muted-foreground">Cashier</span><p className="font-medium">{viewingSale.cashier}</p></div>
                <div><span className="text-muted-foreground">Payment</span><p className="capitalize">{viewingSale.paymentMethod}</p></div>
                <div><span className="text-muted-foreground">Status</span><div><StatusBadge status={viewingSale.status} /></div></div>
                <div><span className="text-muted-foreground">Date</span><p>{formatDateTime(viewingSale.date)}</p></div>
              </div>
              <Separator />
              <div>
                <p className="mb-2 text-sm font-medium">Items</p>
                {viewingSale.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span>{item.productName} x{item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(viewingSale.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{formatCurrency(viewingSale.discount)}</span></div>
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{formatCurrency(viewingSale.total)}</span></div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setViewingSale(null)}>Close</Button>
                <Button variant="outline"><Printer className="mr-2 h-4 w-4" />Print Receipt</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
