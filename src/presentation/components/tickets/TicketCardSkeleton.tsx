import { Skeleton } from "@/presentation/components/ui/Skeleton";

export function TicketCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-soft bg-surface p-5 shadow-card">
      <Skeleton className="h-5 w-2/3" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <Skeleton className="mt-5 h-9 w-full" />
    </div>
  );
}
