"use client";

interface AlertBadgeProps {
  count: number;
}

export function AlertBadge({ count }: AlertBadgeProps) {
  if (count <= 0) return null;

  return (
    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-semibold leading-none">
      {count}
    </span>
  );
}
