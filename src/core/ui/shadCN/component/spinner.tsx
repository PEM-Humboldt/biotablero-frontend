import { Loader } from "lucide-react";

import { cn } from "@ui/shadCN/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  console.log("carajo 666");
  return (
    <Loader
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
