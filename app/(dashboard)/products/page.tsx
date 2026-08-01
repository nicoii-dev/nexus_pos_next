"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { DeleteDialog } from "@/components/delete-dialog";
import { formatCurrency, formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/form-field";
import { Plus, Search, Pencil, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/services/products";
import { CATEGORIES, UNITS } from "@/constants";
import { productSchema, type ProductFormData } from "@/lib/validations/product";
import type { Product } from "@/types";

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", sku: "", barcode: "", description: "", categoryId: "",
      buyingPrice: 0, sellingPrice: 0, currentStock: 0, minimumStock: 0, unit: "pcs", image: "",
    },
  });

  useEffect(() => {
    if (dialogOpen && editingProduct) {
      reset({
        name: editingProduct.name,
        sku: editingProduct.sku,
        barcode: editingProduct.barcode,
        description: editingProduct.description,
        categoryId: editingProduct.categoryId,
        buyingPrice: editingProduct.buyingPrice,
        sellingPrice: editingProduct.sellingPrice,
        currentStock: editingProduct.currentStock,
        minimumStock: editingProduct.minimumStock,
        unit: editingProduct.unit,
        image: editingProduct.image || "",
      });
    }
    if (dialogOpen && !editingProduct) {
      reset({
        name: "", sku: "", barcode: "", description: "", categoryId: "",
        buyingPrice: 0, sellingPrice: 0, currentStock: 0, minimumStock: 0, unit: "pcs", image: "",
      });
    }
  }, [dialogOpen, editingProduct, reset]);

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
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setDialogOpen(true);
  };

  const onSave = async (data: ProductFormData) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data });
    } else {
      await createProduct.mutateAsync(data);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deletingProduct) {
      await deleteProduct.mutateAsync(deletingProduct.id);
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
  };

  if (isLoading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage your product catalog" action={<Button onClick={openAdd} className="rounded-[10px] shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-shadow"><Plus className="mr-2 h-4 w-4" />Add Product</Button>} />

      <div className="flex flex-wrap items-center gap-3 rounded-[10px] border bg-card/60 glass p-3 shadow-float">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or SKU..." className="pl-9 rounded-[10px]" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => { if (v !== null) { setCategoryFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-[180px] rounded-[10px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { if (v !== null) { setStatusFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-[160px] rounded-[10px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="rounded-[10px]"><Download className="mr-2 h-4 w-4" />Export</Button>
      </div>

      {paginated.length === 0 ? (
        <EmptyState title="No products found" description="Try adjusting your search or filters" />
      ) : (
        <div className="rounded-[10px] border bg-card shadow-float overflow-hidden">
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
                  <TableCell><Badge variant="secondary" className="rounded-full">{CATEGORIES.find((c) => c.id === p.categoryId)?.name || "\u2014"}</Badge></TableCell>
                  <TableCell className="text-right">{formatCurrency(p.buyingPrice)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(p.sellingPrice)}</TableCell>
                  <TableCell className="text-right">{formatNumber(p.currentStock)} {p.unit}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[10px]" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[10px] text-destructive hover:text-destructive" onClick={() => { setDeletingProduct(p); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
            <p className="text-sm text-muted-foreground">Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-[10px]" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="rounded-[10px]" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <DialogHeader>
            <DialogTitle className="text-xl">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSave)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Name" error={errors.name?.message}>
                  <Input className="rounded-[10px]" {...register("name")} />
                </FormField>
                <FormField label="SKU" error={errors.sku?.message}>
                  <Input className="rounded-[10px]" {...register("sku")} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Barcode" error={errors.barcode?.message}>
                  <Input className="rounded-[10px]" {...register("barcode")} />
                </FormField>
                <FormField label="Category" error={errors.categoryId?.message}>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-[10px]"><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>
              <FormField label="Description" error={errors.description?.message}>
                <Textarea className="rounded-[10px]" {...register("description")} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Buying Price" error={errors.buyingPrice?.message}>
                  <Input type="number" className="rounded-[10px]" {...register("buyingPrice")} />
                </FormField>
                <FormField label="Selling Price" error={errors.sellingPrice?.message}>
                  <Input type="number" className="rounded-[10px]" {...register("sellingPrice")} />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Current Stock" error={errors.currentStock?.message}>
                  <Input type="number" className="rounded-[10px]" {...register("currentStock")} />
                </FormField>
                <FormField label="Minimum Stock Alert" error={errors.minimumStock?.message}>
                  <Input type="number" className="rounded-[10px]" {...register("minimumStock")} />
                </FormField>
                <FormField label="Unit" error={errors.unit?.message}>
                  <Controller
                    name="unit"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-[10px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-[10px]" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="rounded-[10px] shadow-lg shadow-primary/15">{editingProduct ? "Save Changes" : "Add Product"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Product" description={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`} onConfirm={handleDelete} />
    </div>
  );
}
