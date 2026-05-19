import { Binoculars } from "lucide-react";

import { cn } from "@ui/shadCN/lib/utils";

export function InitiativeIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full aspect-square rounded-full bg-primary overflow-hidden",
        className,
      )}
    >
      <Binoculars
        className="w-full h-full m-0 text-background scale-70"
        strokeWidth={1}
      />
    </div>
  );
}
