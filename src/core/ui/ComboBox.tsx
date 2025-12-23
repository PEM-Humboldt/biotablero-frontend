import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/shadCN/component/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/shadCN/component/popover";

type ComboBoxProps<T> = {
  id?: string;
  items: T[];
  maxItems?: number;
  value: number | string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  uiText: { itemNotFound: string; trigger: string; inputPlaceholder: string };
} & (
  | { keys: { forLabel?: keyof T; forValue: keyof T } }
  | { keys: { forLabel: keyof T; forValue?: keyof T } }
);

export function Combobox<T>({
  id,
  items,
  maxItems,
  value,
  setValue,
  keys,
  uiText,
  disabled = false,
}: ComboBoxProps<T>) {
  const [open, setOpen] = React.useState(false);

  const itemValue = (keys?.forValue ?? keys.forLabel) as keyof T;
  const itemLabel = (keys?.forLabel ?? keys.forValue) as keyof T;

  const componentWidth = "w-full";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          disabled={disabled}
          variant="combobox"
          role="combobox"
          aria-expanded={open}
          className={cn(componentWidth, "justify-between")}
        >
          {value
            ? String(
                items.find(
                  (item) => String(item[itemValue]) === String(value),
                )?.[itemLabel] ?? uiText.itemNotFound,
              )
            : uiText.trigger}

          <ChevronsUpDown className="text-primary" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-(--radix-popover-trigger-width)">
        <Command>
          <CommandInput placeholder={uiText.inputPlaceholder} className="h-9" />

          <CommandList>
            <CommandEmpty>{uiText.itemNotFound}</CommandEmpty>
            <CommandGroup>
              {(maxItems ? items.slice(0, maxItems) : items).map((item) => {
                const itemValueStr = String(item[itemValue]);
                const itemLabelStr = String(item[itemLabel]);

                return (
                  <CommandItem
                    key={itemValueStr}
                    value={itemValueStr}
                    onSelect={() => {
                      const stringId = String(item[itemValue]);
                      setValue(stringId === value ? "" : stringId);
                      setOpen(false);
                    }}
                  >
                    {itemLabelStr}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === itemValueStr ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
