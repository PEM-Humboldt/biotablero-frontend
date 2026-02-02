import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@ui/shadCN/lib/utils";

function NativeSelectFn(
  { className, ...props }: React.ComponentProps<"select">,
  ref: React.ForwardedRef<HTMLSelectElement>,
) {
  return (
    <div
      className="group/native-select w-full relative has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        className={cn(
          "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] disabled:pointer-events-none hover:cursor-pointer disabled:cursor-not-allowed",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
      <ChevronDownIcon
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />;
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  );
}

const NativeSelect = React.forwardRef(NativeSelectFn);

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
