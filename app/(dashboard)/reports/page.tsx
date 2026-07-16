"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { ChartCard } from "@/components/chart-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  ReceiptText,
  Download,
  FileText,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getReportSummary,
  getMonthlyRevenue,
  getPaymentMethodDistribution,
  getSalesTrend,
  getBestCategories,
} from "@/services/reports";
import type { ReportSummary, ChartData } from "@/types";

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#9333ea", "#dc2626"];

export default function ReportsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [revenue, setRevenue] = useState<ChartData[]>([]);
  const [payments, setPayments] = useState<ChartData[]>([]);
  const [salesTrend, setSalesTrend] = useState<ChartData[]>([]);
  const [categories, setCategories] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReportSummary(), getMonthlyRevenue(), getPaymentMethodDistribution(), getSalesTrend(), getBestCategories()]).then(
      ([s, r, p, st, cat]) => {
        setSummary(s);
        setRevenue(r);
        setPayments(p);
        setSalesTrend(st);
        setCategories(cat);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <div className="space-y-6"><LoadingSkeleton type="stat" /><div className="grid gap-6 lg:grid-cols-2"><LoadingSkeleton type="chart" /><LoadingSkeleton type="chart" /></div></div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Analytics and business insights"
        action={
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={(v) => v !== null && setDateRange(v)}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Annually</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Sales" value={summary?.totalSales ?? 0} icon={<ShoppingCart className="h-5 w-5 text-blue-600" />} change={12} changeLabel="vs last month" />
        <StatCard title="Revenue" value={formatCurrency(summary?.revenue ?? 0)} icon={<DollarSign className="h-5 w-5 text-emerald-600" />} change={8} changeLabel="vs last month" />
        <StatCard title="Profit" value={formatCurrency(summary?.profit ?? 0)} icon={<TrendingUp className="h-5 w-5 text-violet-600" />} change={-3} changeLabel="vs last month" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Transactions" value={summary?.transactions ?? 0} icon={<ReceiptText className="h-5 w-5 text-orange-600" />} change={15} changeLabel="vs last month" />
        <StatCard title="Avg Order Value" value={formatCurrency(summary?.averageOrderValue ?? 0)} icon={<DollarSign className="h-5 w-5 text-cyan-600" />} change={5} changeLabel="vs last month" />
        <StatCard title="Income" value={formatCurrency(summary?.income ?? 0)} icon={<TrendingUp className="h-5 w-5 text-emerald-600" />} change={10} changeLabel="vs last month" />
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <ChartCard title="Sales Trend" description="Daily sales performance">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} name="Sales" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <ChartCard title="Monthly Revenue" description="Revenue vs expenses">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="value2" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Top Products">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Category Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <ChartCard title="Payment Methods" description="Distribution of payment types">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={payments} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}%`}>
                  {payments.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline"><FileText className="mr-2 h-4 w-4" />Export PDF</Button>
        <Button variant="outline"><FileSpreadsheet className="mr-2 h-4 w-4" />Export Excel</Button>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export CSV</Button>
      </div>
    </div>
  );
}
