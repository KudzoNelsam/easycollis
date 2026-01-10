import { Skeleton } from "@/app/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Skeleton className="h-16 w-full" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[500px] rounded-lg" />
      </div>
    </div>
  );
}
