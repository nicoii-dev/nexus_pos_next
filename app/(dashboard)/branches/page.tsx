"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, MapPin, Phone, User, Building2, LayoutGrid, List } from "lucide-react";
import { useGetBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from "@/services/branches";
import type { Branch } from "@/types";

export default function BranchesPage() {
  const { data: branches = [], isLoading } = useGetBranches();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const deleteBranch = useDeleteBranch();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: "", address: "", manager: "", contactNumber: "", status: "active" as "active" | "inactive" });

  const filtered = branches.filter((b) => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openAdd = () => {
    setEditingBranch(null);
    setForm({ name: "", address: "", manager: "", contactNumber: "", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (b: Branch) => {
    setEditingBranch(b);
    setForm({ name: b.name, address: b.address, manager: b.manager, contactNumber: b.contactNumber, status: b.status });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingBranch) {
      await updateBranch.mutateAsync({ id: editingBranch.id, data: form });
    } else {
      await createBranch.mutateAsync(form);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deletingBranch) {
      await deleteBranch.mutateAsync(deletingBranch.id);
      setDeleteDialogOpen(false);
      setDeletingBranch(null);
    }
  };

  if (isLoading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Branches" description="Manage your store branches" action={<Button onClick={openAdd} className="rounded-xl shadow-lg shadow-primary/15"><Plus className="mr-2 h-4 w-4" />Add Branch</Button>} />

      <div className="flex items-center gap-3 rounded-2xl border bg-card/60 glass p-3 shadow-float">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search branches..." className="pl-9 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex rounded-xl border bg-muted/50 p-0.5">
          <Button variant={view === "cards" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setView("cards")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setView("table")}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No branches found" description="Add your first branch to get started" action={<Button onClick={openAdd} className="rounded-xl"><Plus className="mr-2 h-4 w-4" />Add Branch</Button>} />
      ) : view === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <Card key={b.id} className="group overflow-hidden transition-all duration-300 card-hover">
              <div className="h-1 bg-gradient-to-r from-primary/60 via-chart-4/40 to-chart-2/50" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-transform duration-300 group-hover:scale-110">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{b.name}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => { setDeletingBranch(b); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /><span>{b.address}</span></div>
                  <div className="flex items-center gap-2"><User className="h-4 w-4 shrink-0" /><span>{b.manager}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><span>{b.contactNumber}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card shadow-float overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.address}</TableCell>
                  <TableCell>{b.manager}</TableCell>
                  <TableCell className="text-sm">{b.contactNumber}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => { setDeletingBranch(b); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md glass-card">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <DialogHeader>
            <DialogTitle className="text-xl">{editingBranch ? "Edit Branch" : "Add Branch"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Branch Name</Label>
              <Input className="rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter branch name" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input className="rounded-xl" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Enter address" />
            </div>
            <div className="space-y-2">
              <Label>Manager</Label>
              <Input className="rounded-xl" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} placeholder="Enter manager name" />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input className="rounded-xl" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} placeholder="Enter contact number" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v as "active" | "inactive" })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="rounded-xl shadow-lg shadow-primary/15" onClick={handleSave}>{editingBranch ? "Save Changes" : "Add Branch"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Branch" description={`Are you sure you want to delete "${deletingBranch?.name}"? This action cannot be undone.`} onConfirm={handleDelete} />
    </div>
  );
}
