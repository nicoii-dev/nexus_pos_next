"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/form-field";
import { Store, Receipt, CreditCard, User, Bell, Palette } from "lucide-react";
import { useGetSettings, useUpdateSettings } from "@/services/settings";
import { CURRENCIES, TIMEZONES } from "@/constants";
import { settingsSchema, type SettingsFormData } from "@/lib/validations/settings";

export default function SettingsPage() {
  const { data: settingsData, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      businessName: "", currency: "PHP", timezone: "Asia/Manila",
      taxRate: 0, receiptHeader: "", receiptFooter: "",
    },
  });

  useEffect(() => {
    if (settingsData) {
      reset({
        businessName: settingsData.businessName,
        currency: settingsData.currency,
        timezone: settingsData.timezone,
        taxRate: settingsData.taxRate,
        receiptHeader: settingsData.receiptHeader || "",
        receiptFooter: settingsData.receiptFooter || "",
      });
    }
  }, [settingsData, reset]);

  const onSave = async (data: SettingsFormData) => {
    await updateSettings.mutateAsync(data);
  };

  if (isLoading) return <LoadingSkeleton type="card" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your store settings" action={<Button onClick={handleSubmit(onSave)} disabled={updateSettings.isPending} className="rounded-[10px] shadow-lg shadow-primary/15">{updateSettings.isPending ? "Saving..." : "Save Changes"}</Button>} />

      <Tabs defaultValue="business">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-6 rounded-[10px]">
          <TabsTrigger value="business" className="rounded-[10px]"><Store className="mr-2 h-4 w-4" />Business</TabsTrigger>
          <TabsTrigger value="receipt" className="rounded-[10px]"><Receipt className="mr-2 h-4 w-4" />Receipt</TabsTrigger>
          <TabsTrigger value="tax" className="rounded-[10px]"><CreditCard className="mr-2 h-4 w-4" />Tax</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-[10px]"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-[10px]"><Bell className="mr-2 h-4 w-4" />Alerts</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-[10px]"><Palette className="mr-2 h-4 w-4" />Theme</TabsTrigger>
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
                <FormField label="Store Name" error={errors.businessName?.message}>
                  <Input className="rounded-[10px]" {...register("businessName")} />
                </FormField>
                <FormField label="Currency" error={errors.currency?.message}>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-[10px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.name} ({c.symbol})</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                <FormField label="Timezone" error={errors.timezone?.message}>
                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-[10px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
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
              <FormField label="Receipt Header" error={errors.receiptHeader?.message}>
                <Input className="rounded-[10px]" {...register("receiptHeader")} />
              </FormField>
              <FormField label="Receipt Footer" error={errors.receiptFooter?.message}>
                <Input className="rounded-[10px]" {...register("receiptFooter")} />
              </FormField>
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
              <FormField label="Tax Rate (%)" error={errors.taxRate?.message}>
                <Input type="number" className="rounded-[10px]" {...register("taxRate")} />
              </FormField>
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
                  <Input className="rounded-[10px]" defaultValue="John Admin" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input className="rounded-[10px]" defaultValue="admin@nexuspos.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input className="rounded-[10px]" type="password" placeholder="Leave blank to keep current" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input className="rounded-[10px]" type="password" placeholder="Confirm new password" />
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
                <div key={i} className="flex items-center justify-between rounded-[10px] border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
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
              <div className="flex items-center justify-between rounded-[10px] border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-[10px] border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
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
