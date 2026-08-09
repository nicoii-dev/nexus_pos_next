"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/format";
import { useGetProducts } from "@/services/products";
import { useGetCategories } from "@/services/categories";
import { useCreateSale } from "@/services/sales";
import { useGetCustomers } from "@/services/customers";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DenominationCalculator } from "@/components/denomination-calculator";
import { FormField } from "@/components/form-field";
import { CustomerFormDialog } from "@/components/customer-form-dialog";
import { Plus, Minus, Trash2, Search, ShoppingCart, Banknote, CreditCard, Smartphone, BookUser, UserPlus, Receipt } from "lucide-react";
import type { PaymentType, Product } from "@/types";

interface CartLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

const PAYMENT_OPTIONS = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "digital", label: "Digital", icon: Smartphone },
  { value: "credit", label: "Credit", icon: BookUser },
] as const;

export default function CashieringPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const { data: categories = [] } = useGetCategories();
  const { data: customers = [] } = useGetCustomers();
  const createSale = useCreateSale();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("cash");
  const [customerId, setCustomerId] = useState("");
  const [tendered, setTendered] = useState<number | null>(null);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((p) => {
      if (p.status === "out_of_stock") return false;
      if (query && !p.name.toLowerCase().includes(query) && !p.sku.toLowerCase().includes(query) && !p.barcode.toLowerCase().includes(query)) return false;
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter]);

  const subtotal = cart.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const discountAmount = Math.min(Math.max(discount, 0), subtotal);
  const total = subtotal - discountAmount;
  const cashChange = tendered !== null ? Math.round((tendered - total) * 100) / 100 : null;
  const itemCount = cart.reduce((sum, l) => sum + l.quantity, 0);
  const selectedCustomer = customers.find((c) => c.id === customerId) ?? null;

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === p.id);
      if (existing) {
        if (existing.quantity >= p.currentStock) return prev;
        return prev.map((l) => (l.productId === p.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { productId: p.id, name: p.name, price: p.sellingPrice, quantity: 1, stock: p.currentStock }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => {
          if (l.productId !== productId) return l;
          const quantity = Math.min(Math.max(l.quantity + delta, 0), l.stock);
          return { ...l, quantity };
        })
        .filter((l) => l.quantity > 0)
    );
  };

  const removeLine = (productId: string) => setCart((prev) => prev.filter((l) => l.productId !== productId));

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === "credit" && !customerId) {
      toast({ title: "Customer required", description: "Please select or create a customer for a credit sale.", variant: "destructive" });
      return;
    }
    try {
      await createSale.mutateAsync({
        items: cart.map((l) => ({
          productId: l.productId,
          productName: l.name,
          quantity: l.quantity,
          price: l.price,
          total: l.price * l.quantity,
          itemTotal: l.price * l.quantity,
        })),
        subtotal,
        discount: discountAmount,
        total,
        paymentMethod,
        ...(paymentMethod === "credit" ? { customerId } : {}),
      });
      setCart([]);
      setDiscount(0);
      setPaymentMethod("cash");
      setCustomerId("");
      setTendered(null);
      toast({ title: "Sale completed", description: `${itemCount} item(s) recorded. ${formatCurrency(total)} via ${paymentMethod}.` });
    } catch {
      toast({ title: "Checkout failed", description: "Unable to record the sale. Please try again.", variant: "destructive" });
    }
  };

  if (isLoading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cashiering"
        description="Ring up sales and record every item sold"
        action={
          <Button className="rounded-[10px]" disabled>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="flex flex-wrap items-center gap-3 rounded-[10px] border bg-card/60 glass p-3 shadow-float">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, SKU, or barcode..." className="pl-9 rounded-[10px]" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => { if (v !== null) setCategoryFilter(v); }}>
              <SelectTrigger className="w-[180px] rounded-[10px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-[10px] border bg-card p-16 text-center text-muted-foreground">
              No products match your search.
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)] min-h-[420px] rounded-[10px] border bg-card/60 glass shadow-float">
              <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((p) => {
                  const line = cart.find((l) => l.productId === p.id);
                  const atMax = !!line && line.quantity >= line.stock;
                  const lowStock = p.status === "low_stock";
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addToCart(p)}
                      className={cn(
                        "group flex flex-col gap-2 rounded-[10px] border bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-float focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20",
                        line && "border-primary/60 bg-primary/5",
                        atMax && "opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary/10 to-primary/5 text-lg font-semibold text-primary">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <Badge variant={lowStock ? "destructive" : "secondary"} className="rounded-full">
                          {lowStock ? `${p.currentStock} low` : `${p.currentStock} ${p.unit}`}
                        </Badge>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.sku}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">{formatCurrency(p.sellingPrice)}</span>
                        {line && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">{line.quantity}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="xl:sticky xl:top-24 h-fit rounded-[10px] border bg-card shadow-float overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3.5">
            <div className="flex items-center gap-2 font-semibold">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Current Order
            </div>
            <Badge variant="secondary" className="rounded-full">{itemCount} item{itemCount === 1 ? "" : "s"}</Badge>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
              <div className="rounded-[10px] bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                <ShoppingCart className="h-6 w-6 text-primary/60" />
              </div>
              <p className="text-sm font-medium">Cart is empty</p>
              <p className="text-xs text-muted-foreground">Tap a product to add it to the order.</p>
            </div>
          ) : (
            <ScrollArea className="h-64 border-b">
              <div className="divide-y">
                {cart.map((l) => (
                  <div key={l.productId} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(l.price)} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon-xs" className="rounded-[10px]" onClick={() => updateQty(l.productId, -1)} aria-label={`Decrease ${l.name}`}>
                        <Minus />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">{l.quantity}</span>
                      <Button variant="outline" size="icon-xs" className="rounded-[10px]" onClick={() => updateQty(l.productId, 1)} disabled={l.quantity >= l.stock} aria-label={`Increase ${l.name}`}>
                        <Plus />
                      </Button>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold tabular-nums">{formatCurrency(l.price * l.quantity)}</span>
                    <Button variant="ghost" size="icon-xs" className="rounded-[10px] text-muted-foreground hover:text-destructive" onClick={() => removeLine(l.productId)} aria-label={`Remove ${l.name}`}>
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="space-y-4 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Discount</span>
              <div className="relative w-32">
                <Input
                  type="number"
                  min={0}
                  max={subtotal}
                  value={discount || ""}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="pr-7 text-right rounded-[10px] tabular-nums"
                  placeholder="0.00"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₱</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold text-primary tabular-nums">{formatCurrency(total)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPaymentMethod(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-[10px] border px-2 py-2.5 text-xs font-medium transition-all",
                      active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {paymentMethod === "cash" && (
              <div className="flex items-center justify-between rounded-[10px] border bg-muted/40 px-3 py-2 text-sm">
                <DenominationCalculator total={total} onApply={(amount) => { setTendered(amount); setPaymentMethod("cash"); }} />
                {cashChange !== null && (
                  <span className={cn("font-semibold tabular-nums", cashChange < 0 ? "text-destructive" : "text-emerald-600")}>
                    {cashChange < 0 ? "Shortage " : "Change "}{formatCurrency(Math.abs(cashChange))}
                  </span>
                )}
              </div>
            )}

            {paymentMethod === "credit" && (
              <div className="space-y-2">
                <FormField label="Customer">
                  <div className="flex gap-2">
                    <Select value={customerId} onValueChange={(v) => { if (v !== null) setCustomerId(v); }}>
                      <SelectTrigger className="flex-1 rounded-[10px]">
                        {selectedCustomer ? (
                          <span className="line-clamp-1">{selectedCustomer.fullName}</span>
                        ) : (
                          <span className="text-muted-foreground">Select customer</span>
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-[10px]"
                      onClick={() => setCustomerDialogOpen(true)}
                      title="New customer"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </FormField>
                {customers.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No customers yet. Click <span className="font-medium">+</span> to create one.
                  </p>
                )}
              </div>
            )}

            <Button className="w-full h-10 text-sm rounded-[10px] shadow-lg shadow-primary/15" disabled={cart.length === 0 || createSale.isPending || (paymentMethod === "credit" && !customerId)} onClick={handleCheckout}>
              <Receipt className="mr-2 h-4 w-4" />
              {createSale.isPending ? "Recording sale..." : `Charge ${formatCurrency(total)}`}
            </Button>
          </div>
        </div>
      </div>

      <CustomerFormDialog
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
        onSuccess={(customer) => setCustomerId(customer.id)}
      />
    </div>
  );
}
