"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/form-field";
import { Eye, EyeOff, Loader2, Store } from "lucide-react";
import { useLogin } from "@/services/auth";
import { loginSchema, type LoginFormData } from "@/lib/validations/login";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      router.push("/dashboard");
    } catch {
      // error handled by form
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0 mesh-gradient" />

      <div className="absolute top-[10%] left-[10%] h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-chart-4/[0.05] blur-[80px] animate-[float_10s_ease-in-out_infinite_2s]" />
      <div className="absolute top-[50%] right-[20%] h-[300px] w-[300px] rounded-full bg-chart-2/[0.04] blur-[70px] animate-[float_12s_ease-in-out_infinite_4s]" />

      <div className="absolute top-16 left-1/4 h-2 w-2 rounded-full bg-primary/20 animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-24 right-1/3 h-1.5 w-1.5 rounded-full bg-chart-4/20 animate-[float_8s_ease-in-out_infinite_1s]" />
      <div className="absolute top-1/3 right-16 h-1 w-1 rounded-full bg-chart-2/25 animate-[float_7s_ease-in-out_infinite_3s]" />

      <div className="relative z-10 w-full max-w-md animate-in-scale">
        <div className="mb-10 text-center">
          <div className="relative mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-glow-xl">
            <Store className="h-9 w-9" />
            <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-white/25 to-transparent" />
            <div className="absolute -inset-1 rounded-[10px] bg-gradient-to-br from-primary/20 to-primary/5 blur-xl -z-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gradient">Nexus POS</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to your management dashboard</p>
        </div>

        <Card className="shadow-elevated border-border/40 glass-card overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField label="Email" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="admin@nexuspos.com"
                  className="h-11 rounded-[10px]"
                  {...register("email")}
                />
              </FormField>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <button type="button" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 rounded-[10px] pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password?.message && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Remember me</Label>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
                <Button type="submit" className="w-full h-11 rounded-[10px] font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-primary/90 transition-all duration-300" disabled={login.isPending}>
                  {login.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
