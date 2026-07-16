"use client";

import { StatCard } from "@/components/stat-card";
import { ChartCard } from "@/components/chart-card";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ReceiptText,
  Package,
  AlertTriangle,
  XCircle,
  Plus,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { getDashboardStats, getSalesTrend, getRevenueTrend, getTopSellingProducts, getBestCategories } from "@/services/reports";
import { getSales } from "@/services/sales";
import { getProducts } from "@/services/products";
import type { DashboardStats, ChartData, Sale, Product } from "@/types";

const PIE_COLORS = ["#2563eb", "#16a34a", "#ea580c", "#9333ea", "#dc2626"];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesTrend, setSalesTrend] = useState<ChartData[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<ChartData[]>([]);
  const [topProducts, setTopProducts] = useState<ChartData[]>([]);
  const [categories, setCategories] = useState<ChartData[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, st, rt, tp, cat, sl, pr] = await Promise.all([
        getDashboardStats(),
        getSalesTrend(),
        getRevenueTrend(),
        getTopSellingProducts(),
        getBestCategories(),
        getSales(),
        getProducts(),
      ]);
      setStats(s);
      setSalesTrend(st);
      setRevenueTrend(rt);
      setTopProducts(tp);
      setCategories(cat);
      setRecentSales(sl.slice(0, 5));
      setLowStockProducts(pr.filter((p) => p.status !== "in_stock").slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="space-y-6"><LoadingSkeleton type="stat" /><div className="grid gap-6 lg:grid-cols-2"><LoadingSkeleton type="chart" /><LoadingSkeleton type="chart" /></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your store performance</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm"><Plus className="mr-2 h-4 w-4" />New Sale</Button>
          <Button size="sm" variant="outline"><FileText className="mr-2 h-4 w-4" />View Reports</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Sales" value={stats?.todaysSales ?? 0} icon={<ShoppingCart className="h-5 w-5 text-blue-600" />} change={12} />
        <StatCard title="Today's Revenue" value={formatCurrency(stats?.todaysRevenue ?? 0)} icon={<DollarSign className="h-5 w-5 text-emerald-600" />} change={8} />
        <StatCard title="Today's Profit" value={formatCurrency(stats?.todaysProfit ?? 0)} icon={<TrendingUp className="h-5 w-5 text-violet-600" />} change={-3} />
        <StatCard title="Transactions" value={stats?.todaysTransactions ?? 0} icon={<ReceiptText className="h-5 w-5 text-orange-600" />} change={15} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={<Package className="h-5 w-5 text-cyan-600" />} />
        <StatCard title="Low Stock" value={stats?.lowStockProducts ?? 0} icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} />
        <StatCard title="Out of Stock" value={stats?.outOfStockProducts ?? 0} icon={<XCircle className="h-5 w-5 text-red-600" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Sales Trend" description="Last 7 days">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Trend" description="This week vs last week">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value2" fill="#93c5fd" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Top Selling Products">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" />
              <YAxis type="category" dataKey="name" width={140} className="text-xs" />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Best Categories">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {categories.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-6 pb-4">
            <SectionHeader title="Recent Transactions" description="Latest sales" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.transactionNumber}</TableCell>
                  <TableCell>{formatCurrency(sale.total)}</TableCell>
                  <TableCell><StatusBadge status={sale.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDateTime(sale.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-6 pb-4">
            <SectionHeader title="Low Stock Alert" description="Products needing attention" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{formatNumber(product.currentStock)} {product.unit}</TableCell>
                  <TableCell><StatusBadge status={product.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
