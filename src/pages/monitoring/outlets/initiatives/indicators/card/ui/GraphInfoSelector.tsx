import type { Dispatch, SetStateAction } from "react";

import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";
import { CheckIcon } from "lucide-react";

export function GraphInfoSelector({
  uiText,
  options,
  current,
  updateCurrent,
  singleSelect = true,
}: {
  uiText: { title: string; label: string; instruction?: string };
  options: string[] | { title: string; subtitle: string; color: string }[];
  current: string | string[];
  updateCurrent: Dispatch<SetStateAction<string>> | ((select: string) => void);
  singleSelect?: boolean;
}) {
  return (
    <div title={uiText.title} className="p-2">
      <h4 className="text-base text-primary">{uiText.label}</h4>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
        {(options ?? []).map((option) => {
          const isCustom = typeof option !== "string";
          const title = isCustom ? option.title : option;
          const isSelected = singleSelect
            ? title === current
            : current.includes(title);

          return (
            <li key={`selectorBtn_${title}`}>
              <Button
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "w-full",
                  singleSelect && isSelected ? "" : "hover:cursor-pointer",
                  "opacity-100!",
                )}
                onClick={() => updateCurrent(title)}
                aria-pressed={isSelected}
                disabled={singleSelect ? isSelected : false}
              >
                {title}
                {isSelected && <CheckIcon />}
              </Button>
            </li>
          );
        })}
      </ul>

      {uiText.instruction && (
        <span className="italic text-primary font-normal text-sm m-0">
          {uiText.instruction}
        </span>
      )}
    </div>
  );
}
