"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { ChartCard } from "@/components/chart-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  ReceiptText,
  Download,
  FileText,
  FileSpreadsheet,
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
  useGetReportSummary,
  useGetMonthlyRevenue,
  useGetPaymentMethodDistribution,
  useGetSalesTrend,
  useGetBestCategories,
} from "@/services/reports";

const COLORS = ["#6366f1", "#10b981", "#f97316", "#a855f7", "#ef4444"];

export default function ReportsPage() {
  const { data: summary } = useGetReportSummary();
  const { data: revenue = [] } = useGetMonthlyRevenue();
  const { data: payments = [] } = useGetPaymentMethodDistribution();
  const { data: salesTrend = [] } = useGetSalesTrend();
  const { data: categories = [] } = useGetBestCategories();
  const [dateRange, setDateRange] = useState("month");

  const isLoading = !summary;

  if (isLoading) return <div className="space-y-6"><LoadingSkeleton type="stat" /><div className="grid gap-6 lg:grid-cols-2"><LoadingSkeleton type="chart" /><LoadingSkeleton type="chart" /></div></div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Analytics and business insights"
        action={
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={(v) => v !== null && setDateRange(v)}>
              <SelectTrigger className="w-[160px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Annually</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" />Export</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Sales" value={summary?.totalSales ?? 0} icon={<ShoppingCart className="h-5 w-5 text-blue-500" />} change={12} changeLabel="vs last month" />
        <StatCard title="Revenue" value={formatCurrency(summary?.revenue ?? 0)} icon={<DollarSign className="h-5 w-5 text-emerald-500" />} change={8} changeLabel="vs last month" />
        <StatCard title="Profit" value={formatCurrency(summary?.profit ?? 0)} icon={<TrendingUp className="h-5 w-5 text-violet-500" />} change={-3} changeLabel="vs last month" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Transactions" value={summary?.transactions ?? 0} icon={<ReceiptText className="h-5 w-5 text-orange-500" />} change={15} changeLabel="vs last month" />
        <StatCard title="Avg Order Value" value={formatCurrency(summary?.averageOrderValue ?? 0)} icon={<DollarSign className="h-5 w-5 text-cyan-500" />} change={5} changeLabel="vs last month" />
        <StatCard title="Income" value={formatCurrency(summary?.income ?? 0)} icon={<TrendingUp className="h-5 w-5 text-emerald-500" />} change={10} changeLabel="vs last month" />
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="rounded-xl">
          <TabsTrigger value="sales" className="rounded-lg">Sales</TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-lg">Revenue</TabsTrigger>
          <TabsTrigger value="products" className="rounded-lg">Products</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <ChartCard title="Sales Trend" description="Daily sales performance">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesTrend}>
                <defs>
                  <linearGradient id="reportSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "var(--card)" }} name="Sales" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <ChartCard title="Monthly Revenue" description="Revenue vs expenses">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenue}>
                <defs>
                  <linearGradient id="reportRevGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="reportRevGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a5b4fc" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="url(#reportRevGrad1)" radius={[6, 6, 0, 0]} name="Revenue" />
                <Bar dataKey="value2" fill="url(#reportRevGrad2)" radius={[6, 6, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Top Products">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Category Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
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
                <Pie data={payments} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} label={({ name, value }) => `${name}: ${value}%`}>
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
        <Button variant="outline" className="rounded-xl"><FileText className="mr-2 h-4 w-4" />Export PDF</Button>
        <Button variant="outline" className="rounded-xl"><FileSpreadsheet className="mr-2 h-4 w-4" />Export Excel</Button>
        <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" />Export CSV</Button>
      </div>
    </div>
  );
}
