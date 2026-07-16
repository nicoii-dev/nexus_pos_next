"use client";

import { useState, useEffect } from "react";
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
import { getBranches, createBranch, updateBranch, deleteBranch } from "@/services/branches";
import type { Branch } from "@/types";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: "", address: "", manager: "", contactNumber: "", status: "active" as "active" | "inactive" });

  useEffect(() => {
    getBranches().then((b) => { setBranches(b); setLoading(false); });
  }, []);

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
      await updateBranch(editingBranch.id, form);
    } else {
      await createBranch(form);
    }
    const updated = await getBranches();
    setBranches(updated);
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deletingBranch) {
      await deleteBranch(deletingBranch.id);
      const updated = await getBranches();
      setBranches(updated);
      setDeleteDialogOpen(false);
      setDeletingBranch(null);
    }
  };

  if (loading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Branches" description="Manage your store branches" action={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Branch</Button>} />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search branches..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex rounded-lg border bg-card p-0.5">
          <Button variant={view === "cards" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("cards")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("table")}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No branches found" description="Add your first branch to get started" action={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Branch</Button>} />
      ) : view === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <Card key={b.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{b.name}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setDeletingBranch(b); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
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
        <div className="rounded-xl border bg-card shadow-sm">
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
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setDeletingBranch(b); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBranch ? "Edit Branch" : "Add Branch"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Branch Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter branch name" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Enter address" />
            </div>
            <div className="space-y-2">
              <Label>Manager</Label>
              <Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} placeholder="Enter manager name" />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} placeholder="Enter contact number" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v as "active" | "inactive" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingBranch ? "Save Changes" : "Add Branch"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete Branch" description={`Are you sure you want to delete "${deletingBranch?.name}"? This action cannot be undone.`} onConfirm={handleDelete} />
    </div>
  );
}
