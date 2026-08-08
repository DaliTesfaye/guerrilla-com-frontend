"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  useEffect(() => {
    if (!hydrated || !token || !user) {
      return;
    }

    if (user.mustChangePassword && pathname !== "/dashboard/change-password") {
      router.replace("/dashboard/change-password");
    }
  }, [hydrated, token, user, pathname, router]);

  useEffect(() => {
    if (!hydrated || !token || !user) {
      return;
    }

    const isUsersManagementRoute = pathname.startsWith("/dashboard/users");
    if (isUsersManagementRoute && user.role !== "super_admin") {
      router.replace("/dashboard/home");
    }
  }, [hydrated, token, user, pathname, router]);

  if (!hydrated || !token) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center text-sm text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Header />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
