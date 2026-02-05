"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import Breadcrumbs from "../components/breadcrumbs";
import { useAuth } from "@/lib/auth-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      if (user.role === "admin") router.push("/dashboard/admin");
      else if (user.role === "gp") router.push("/dashboard/gp");
      else router.push("/dashboard/client");
    }
  }, [user, isLoading, router]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Breadcrumbs />
      </div>
      <div className="p-5 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
