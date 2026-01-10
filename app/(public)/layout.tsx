"use client";

import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import Breadcrumbs from "../components/breadcrumbs";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Breadcrumbs />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
