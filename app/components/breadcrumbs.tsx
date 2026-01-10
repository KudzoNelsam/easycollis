"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Crumb = { label: string; href?: string };

function formatLabel(segment: string) {
  return decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function Breadcrumbs({
  crumbs,
  showBack = true,
  className = "",
}: {
  crumbs?: Crumb[];
  showBack?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const handleBack = () => router.back();

  // If crumbs are provided explicitly, use them. Otherwise generate from pathname.
  let computedCrumbs: Crumb[] = [];
  if (crumbs && crumbs.length > 0) computedCrumbs = crumbs;
  else if (pathname && pathname !== "/") {
    const segments = pathname.split("/").filter(Boolean);
    computedCrumbs = [
      { label: "Accueil", href: "/" },
      ...segments.map((seg, idx) => ({
        label: formatLabel(seg),
        href: "/" + segments.slice(0, idx + 1).join("/"),
      })),
    ];
  }

  // Hide on root page
  if (!computedCrumbs || computedCrumbs.length === 0) return null;

  return (
    <div className={`mb-6 mt-6 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </button>
        )}

        <nav className="text-sm text-muted-foreground">
          {computedCrumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center">
              {c.href && i < computedCrumbs.length - 1 ? (
                <Link
                  href={c.href}
                  className="hover:underline text-muted-foreground"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{c.label}</span>
              )}
              {i < computedCrumbs.length - 1 && <span className="mx-2">/</span>}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
