"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Receipt, CreditCard, User, Bell, Palette } from "lucide-react";
import { useGetSettings, useUpdateSettings } from "@/services/settings";
import { CURRENCIES, TIMEZONES } from "@/constants";
import type { Settings } from "@/types";

export default function SettingsPage() {
  const { data: settingsData, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    if (settingsData) setSettings(settingsData);
  }, [settingsData]);

  const handleSave = async () => {
    if (!settings) return;
    await updateSettings.mutateAsync(settings);
  };

  if (isLoading || !settings) return <LoadingSkeleton type="card" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your store settings" action={<Button onClick={handleSave} disabled={updateSettings.isPending} className="rounded-xl shadow-lg shadow-primary/15">{updateSettings.isPending ? "Saving..." : "Save Changes"}</Button>} />

      <Tabs defaultValue="business">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-6 rounded-xl">
          <TabsTrigger value="business" className="rounded-lg"><Store className="mr-2 h-4 w-4" />Business</TabsTrigger>
          <TabsTrigger value="receipt" className="rounded-lg"><Receipt className="mr-2 h-4 w-4" />Receipt</TabsTrigger>
          <TabsTrigger value="tax" className="rounded-lg"><CreditCard className="mr-2 h-4 w-4" />Tax</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg"><Bell className="mr-2 h-4 w-4" />Alerts</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg"><Palette className="mr-2 h-4 w-4" />Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary/60 via-chart-4/40 to-chart-2/50" />
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input className="rounded-xl" value={settings.businessName} onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={(v) => v && setSettings({ ...settings, currency: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.name} ({c.symbol})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(v) => v && setSettings({ ...settings, timezone: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipt" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-chart-2/60 via-primary/40 to-chart-5/50" />
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>Customize your receipt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Receipt Header</Label>
                <Input className="rounded-xl" value={settings.receiptHeader} onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Receipt Footer</Label>
                <Input className="rounded-xl" value={settings.receiptFooter} onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-chart-3/60 via-primary/40 to-chart-4/50" />
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input type="number" className="rounded-xl" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary/60 via-chart-2/40 to-chart-5/50" />
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input className="rounded-xl" defaultValue="John Admin" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input className="rounded-xl" defaultValue="admin@nexuspos.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input className="rounded-xl" type="password" placeholder="Leave blank to keep current" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input className="rounded-xl" type="password" placeholder="Confirm new password" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-chart-3/60 via-chart-4/40 to-primary/50" />
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Low stock alerts", description: "Get notified when products are low in stock" },
                { label: "Out of stock alerts", description: "Get notified when products go out of stock" },
                { label: "Daily sales summary", description: "Receive daily sales summary reports" },
                { label: "New transaction alerts", description: "Get notified for each new transaction" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary/40 via-chart-4/50 to-chart-2/60" />
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <div>
                  <p className="font-medium">Sidebar Collapsed</p>
                  <p className="text-sm text-muted-foreground">Start with sidebar collapsed</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
