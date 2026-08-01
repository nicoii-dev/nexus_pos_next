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
import { useGetDashboardStats, useGetSalesTrend, useGetRevenueTrend, useGetTopSellingProducts, useGetBestCategories } from "@/services/reports";
import { useGetSales } from "@/services/sales";
import { useGetProducts } from "@/services/products";

const PIE_COLORS = ["#6366f1", "#10b981", "#f97316", "#a855f7", "#ef4444"];

export default function DashboardPage() {
  const { data: stats } = useGetDashboardStats();
  const { data: salesTrend = [] } = useGetSalesTrend();
  const { data: revenueTrend = [] } = useGetRevenueTrend();
  const { data: topProducts = [] } = useGetTopSellingProducts();
  const { data: categories = [] } = useGetBestCategories();
  const { data: sales = [] } = useGetSales();
  const { data: products = [] } = useGetProducts();

  const isLoading = !stats;
  const recentSales = sales.slice(0, 5);
  const lowStockProducts = products.filter((p) => p.status !== "in_stock").slice(0, 5);

  if (isLoading) return <div className="space-y-6"><LoadingSkeleton type="stat" /><div className="grid gap-6 lg:grid-cols-2"><LoadingSkeleton type="chart" /><LoadingSkeleton type="chart" /></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-in-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your store performance</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="rounded-[10px] shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-shadow"><Plus className="mr-2 h-4 w-4" />New Sale</Button>
          <Button size="sm" variant="outline" className="rounded-[10px]"><FileText className="mr-2 h-4 w-4" />View Reports</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: "0.05s" }}>
        <StatCard title="Today's Sales" value={stats?.todaysSales ?? 0} icon={<ShoppingCart className="h-5 w-5 text-blue-500" />} change={12} />
        <StatCard title="Today's Revenue" value={formatCurrency(stats?.todaysRevenue ?? 0)} icon={<DollarSign className="h-5 w-5 text-emerald-500" />} change={8} />
        <StatCard title="Today's Profit" value={formatCurrency(stats?.todaysProfit ?? 0)} icon={<TrendingUp className="h-5 w-5 text-violet-500" />} change={-3} />
        <StatCard title="Transactions" value={stats?.todaysTransactions ?? 0} icon={<ReceiptText className="h-5 w-5 text-orange-500" />} change={15} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={<Package className="h-5 w-5 text-cyan-500" />} />
        <StatCard title="Low Stock" value={stats?.lowStockProducts ?? 0} icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} />
        <StatCard title="Out of Stock" value={stats?.outOfStockProducts ?? 0} icon={<XCircle className="h-5 w-5 text-red-500" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Sales Trend" description="Last 7 days">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "var(--card)" }} activeDot={{ r: 6, strokeWidth: 2, stroke: "#6366f1" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Trend" description="This week vs last week">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueTrend}>
              <defs>
                <linearGradient id="revenueGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a5b4fc" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="value" fill="url(#revenueGrad1)" radius={[10, 10, 0, 0]} />
              <Bar dataKey="value2" fill="url(#revenueGrad2)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Top Selling Products">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis type="number" className="text-xs" />
              <YAxis type="category" dataKey="name" width={140} className="text-xs" />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Best Categories">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={50} paddingAngle={3} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
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
        <div className="rounded-[10px] border bg-card shadow-float overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
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
                  <TableCell className="font-medium font-mono">{sale.transactionNumber}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(sale.total)}</TableCell>
                  <TableCell><StatusBadge status={sale.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDateTime(sale.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-[10px] border bg-card shadow-float overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
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
