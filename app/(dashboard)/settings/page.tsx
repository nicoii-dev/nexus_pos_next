"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Receipt, CreditCard, User, Bell, Palette } from "lucide-react";
import { getSettings, updateSettings } from "@/services/settings";
import { CURRENCIES, TIMEZONES } from "@/constants";
import type { Settings } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((s) => { setSettings(s); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
  };

  if (loading || !settings) return <LoadingSkeleton type="card" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your store settings" action={<Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>} />

      <Tabs defaultValue="business">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-6">
          <TabsTrigger value="business"><Store className="mr-2 h-4 w-4" />Business</TabsTrigger>
          <TabsTrigger value="receipt"><Receipt className="mr-2 h-4 w-4" />Receipt</TabsTrigger>
          <TabsTrigger value="tax"><CreditCard className="mr-2 h-4 w-4" />Tax</TabsTrigger>
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Alerts</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" />Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input value={settings.businessName} onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={(v) => v && setSettings({ ...settings, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.name} ({c.symbol})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(v) => v && setSettings({ ...settings, timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>Customize your receipt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Receipt Header</Label>
                <Input value={settings.receiptHeader} onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Receipt Footer</Label>
                <Input value={settings.receiptFooter} onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input type="number" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="John Admin" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="admin@nexuspos.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Leave blank to keep current" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
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
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
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
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
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
