"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { DeleteDialog } from "@/components/delete-dialog";
import { formatCurrency, formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services/products";
import { CATEGORIES, UNITS } from "@/constants";
import type { Product } from "@/types";

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", sku: "", barcode: "", description: "", categoryId: "", buyingPrice: 0, sellingPrice: 0, currentStock: 0, minimumStock: 0, unit: "pcs", image: "" });

  useEffect(() => {
    getProducts().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ name: "", sku: "", barcode: "", description: "", categoryId: "", buyingPrice: 0, sellingPrice: 0, currentStock: 0, minimumStock: 0, unit: "pcs", image: "" });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, sku: p.sku, barcode: p.barcode, description: p.description, categoryId: p.categoryId, buyingPrice: p.buyingPrice, sellingPrice: p.sellingPrice, currentStock: p.currentStock, minimumStock: p.minimumStock, unit: p.unit, image: p.image || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, form);
    } else {
      await createProduct(form);
    }
    const updated = await getProducts();
    setProducts(updated);
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deletingProduct) {
      await deleteProduct(deletingProduct.id);
      const updated = await getProducts();
      setProducts(updated);
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
  };

  if (loading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage your product catalog" action={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Product</Button>} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or SKU..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => { if (v !== null) { setCategoryFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { if (v !== null) { setStatusFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
      </div>

      {paginated.length === 0 ? (
        <EmptyState title="No products found" description="Try adjusting your search or filters" />
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Buying</TableHead>
                <TableHead className="text-right">Selling</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{p.sku}</TableCell>
                  <TableCell><Badge variant="secondary">{CATEGORIES.find((c) => c.id === p.categoryId)?.name || "—"}</Badge></TableCell>
                  <TableCell className="text-right">{formatCurrency(p.buyingPrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.sellingPrice)}</TableCell>
                  <TableCell className="text-right">{formatNumber(p.currentStock)} {p.unit}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setDeletingProduct(p); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Barcode</Label>
                <Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.categoryId} onValueChange={(v) => v !== null && setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Buying Price</Label>
                <Input type="number" value={form.buyingPrice} onChange={(e) => setForm({ ...form, buyingPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Selling Price</Label>
                <Input type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Current Stock</Label>
                <Input type="number" value={form.currentStock} onChange={(e) => setForm({ ...form, currentStock: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Minimum Stock Alert</Label>
                <Input type="number" value={form.minimumStock} onChange={(e) => setForm({ ...form, minimumStock: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={(v) => v !== null && setForm({ ...form, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingProduct ? "Save Changes" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Product" description={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`} onConfirm={handleDelete} />
    </div>
  );
}
