"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetCurrentUser } from "@/services/auth";
import { canAccessRoute, getDefaultRoute } from "@/constants";
import { LoadingSkeleton } from "@/components/loading-skeleton";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;
    if (!canAccessRoute(user.role, pathname)) {
      router.replace(getDefaultRoute(user.role));
    }
  }, [user, pathname, isLoading, router]);

  if (isLoading) {
    return (
      <div className="p-5 lg:p-8">
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  if (user && !canAccessRoute(user.role, pathname)) {
    return (
      <div className="p-5 lg:p-8">
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return <>{children}</>;
}
