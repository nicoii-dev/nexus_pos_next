"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { formatNumber, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Package, AlertTriangle, XCircle, ArrowDownToLine, ArrowUpFromLine, Pencil } from "lucide-react";
import { useGetInventoryMovements } from "@/services/inventory";
import { useGetProducts } from "@/services/products";

export default function InventoryPage() {
  const { data: movements = [], isLoading: movementsLoading } = useGetInventoryMovements();
  const { data: products = [], isLoading: productsLoading } = useGetProducts();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = movements.filter((m) => {
    if (search && !m.productName.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && m.type !== typeFilter) return false;
    return true;
  });

  const lowStock = products.filter((p) => p.status === "low_stock");
  const outOfStock = products.filter((p) => p.status === "out_of_stock");

  if (movementsLoading || productsLoading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track stock movements and inventory status" action={<Button className="rounded-[10px] shadow-lg shadow-primary/15"><Plus className="mr-2 h-4 w-4" />Record Movement</Button>} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Products" value={products.length} icon={<Package className="h-5 w-5 text-blue-500" />} />
        <StatCard title="Low Stock Items" value={lowStock.length} icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} />
        <StatCard title="Out of Stock" value={outOfStock.length} icon={<XCircle className="h-5 w-5 text-red-500" />} />
      </div>

      <Tabs defaultValue="movements">
        <TabsList className="rounded-[10px]">
          <TabsTrigger value="movements" className="rounded-[10px]">Movements</TabsTrigger>
          <TabsTrigger value="low-stock" className="rounded-[10px]">Low Stock ({lowStock.length})</TabsTrigger>
          <TabsTrigger value="out-of-stock" className="rounded-[10px]">Out of Stock ({outOfStock.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9 rounded-[10px]" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={(v) => v !== null && setTypeFilter(v)}>
              <SelectTrigger className="w-[180px] rounded-[10px]"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="stock_in">Stock In</SelectItem>
                <SelectItem value="stock_out">Stock Out</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-[10px] border bg-card shadow-float overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {m.type === "stock_in" ? (
                          <ArrowDownToLine className="h-3.5 w-3.5 text-emerald-500" />
                        ) : m.type === "stock_out" ? (
                          <ArrowUpFromLine className="h-3.5 w-3.5 text-red-500" />
                        ) : (
                          <Pencil className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span className="capitalize text-sm">{m.type.replace("_", " ")}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${m.quantity > 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {m.quantity > 0 ? "+" : ""}{formatNumber(m.quantity)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.notes}</TableCell>
                    <TableCell className="text-sm">{m.performedBy}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(m.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          {lowStock.length === 0 ? (
            <div className="rounded-[10px] border bg-card p-8 text-center text-muted-foreground">No low stock products</div>
          ) : (
            <div className="rounded-[10px] border bg-card shadow-float overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Minimum</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStock.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{p.sku}</TableCell>
                      <TableCell className="text-right">{formatNumber(p.currentStock)} {p.unit}</TableCell>
                      <TableCell className="text-right">{formatNumber(p.minimumStock)} {p.unit}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="out-of-stock" className="space-y-4">
          {outOfStock.length === 0 ? (
            <div className="rounded-[10px] border bg-card p-8 text-center text-muted-foreground">No out of stock products</div>
          ) : (
            <div className="rounded-[10px] border bg-card shadow-float overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outOfStock.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{p.sku}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
