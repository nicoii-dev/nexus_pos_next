"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Banknote, Calculator, Check, CircleDollarSign, Coins, Minus, Plus, RotateCcw } from "lucide-react";

type Denomination = { label: string; value: number };

const BILLS: Denomination[] = [
  { label: "₱1000", value: 1000 },
  { label: "₱500", value: 500 },
  { label: "₱200", value: 200 },
  { label: "₱100", value: 100 },
  { label: "₱50", value: 50 },
  { label: "₱20", value: 20 },
];

const COINS: Denomination[] = [
  { label: "₱20", value: 20 },
  { label: "₱10", value: 10 },
  { label: "₱5", value: 5 },
  { label: "₱1", value: 1 },
  { label: "25¢", value: 0.25 },
  { label: "5¢", value: 0.05 },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

interface DenominationCalculatorProps {
  total: number;
  onApply?: (tendered: number) => void;
}

interface DenominationGroupProps {
  title: string;
  icon: typeof Banknote;
  items: Denomination[];
  counts: Record<string, number>;
  onCountChange: (value: number, qty: number) => void;
}

function DenominationGroup({ title, icon: Icon, items, counts, onCountChange }: DenominationGroupProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {title}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((d) => (
          <div key={d.value} className="flex items-center justify-between gap-2 rounded-[10px] border bg-card px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tabular-nums">{d.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">×{counts[String(d.value)] || 0}</span>
            </div>
            <CountStepper value={counts[String(d.value)] || 0} onChange={(v) => onCountChange(d.value, v)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CountStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.max(0, Math.floor(v) || 0));
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon-xs" className="rounded-[10px]" onClick={() => set(value - 1)} aria-label="Decrease count">
        <Minus />
      </Button>
      <Input
        type="number"
        min={0}
        inputMode="numeric"
        value={value || ""}
        onChange={(e) => set(Number(e.target.value))}
        className="h-7 w-14 rounded-[10px] px-1 text-center text-sm tabular-nums"
        aria-label="Count"
      />
      <Button variant="outline" size="icon-xs" className="rounded-[10px]" onClick={() => set(value + 1)} aria-label="Increase count">
        <Plus />
      </Button>
    </div>
  );
}

export function DenominationCalculator({ total, onApply }: DenominationCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [others, setOthers] = useState("");

  const countedTotal = useMemo(
    () =>
      round2(
        Object.entries(counts).reduce((sum, [value, qty]) => sum + Number(value) * qty, 0)
      ),
    [counts]
  );
  const othersAmount = round2(Number(others) || 0);
  const tendered = round2(countedTotal + othersAmount);
  const change = round2(tendered - total);
  const isShort = change < 0;

  const setCount = (value: number, qty: number) =>
    setCounts((prev) => {
      const next = { ...prev, [String(value)]: Math.max(0, Math.floor(qty) || 0) };
      if (!next[String(value)]) delete next[String(value)];
      return next;
    });

  const reset = () => {
    setCounts({});
    setOthers("");
  };

  const apply = () => {
    onApply?.(tendered);
    setOpen(false);
  };

  return (
    <>
      <Button type="button" variant="outline" className="rounded-[10px]" onClick={() => setOpen(true)}>
        <Calculator className="mr-2 h-4 w-4" />
        Denominations
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Denomination Calculator
            </DialogTitle>
            <DialogDescription>Count tendered cash in Philippine peso denominations.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2 rounded-[10px] border bg-muted/40 p-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Amount Due</p>
                <p className="font-semibold tabular-nums">{formatCurrency(total)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tendered</p>
                <p className="font-semibold tabular-nums">{formatCurrency(tendered)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{isShort ? "Shortage" : "Change"}</p>
                <p className={cn("font-semibold tabular-nums", isShort ? "text-destructive" : "text-emerald-600")}>
                  {isShort ? "-" : ""}{formatCurrency(Math.abs(change))}
                </p>
              </div>
            </div>

            <div className="max-h-[46vh] space-y-4 overflow-y-auto pr-1">
              <DenominationGroup title="Bills" icon={Banknote} items={BILLS} counts={counts} onCountChange={setCount} />
              <Separator />
              <DenominationGroup title="Coins" icon={Coins} items={COINS} counts={counts} onCountChange={setCount} />
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <CircleDollarSign className="h-3.5 w-3.5 text-primary" />
                  Others
                </div>
                <div className="flex items-center gap-2 rounded-[10px] border bg-card px-3 py-2">
                  <span className="text-sm font-semibold">Custom amount</span>
                  <Input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    step="0.01"
                    placeholder="0.00"
                    value={others}
                    onChange={(e) => setOthers(e.target.value)}
                    className="ml-auto h-7 w-28 rounded-[10px] text-right tabular-nums"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Use for checks, vouchers, or any amount outside standard denominations.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={reset} disabled={countedTotal === 0 && !others}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button type="button" onClick={apply} disabled={tendered <= 0}>
              <Check className="mr-2 h-4 w-4" />
              Apply {formatCurrency(tendered)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
