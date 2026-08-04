import type { Dispatch, SetStateAction } from "react";

import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";
import { CheckIcon } from "lucide-react";
import { hashStringToRange } from "@utils/format";
import {
  getContrastColor,
  getSeriesColor,
} from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";
import { GRAPHS_CONTRAST_COLOR_PALETTE } from "@config/monitoring";

export function GraphInfoSelector({
  uiText,
  options,
  currentSelection,
  updateCurrent,
  singleSelect = true,
  colorFromOptionHash = false,
  highContrast = false,
}: {
  uiText: { title: string; label: string; instruction?: string };
  options: string[] | { title: string; subtitle?: string }[];
  currentSelection: string | string[];
  updateCurrent:
    | Dispatch<SetStateAction<string | string[]>>
    | ((select: string | string[]) => void);
  singleSelect?: boolean;
  colorFromOptionHash?: boolean;
  highContrast?: boolean;
}) {
  return (
    <div title={uiText.title}>
      <h4 className="text-base/2 text-primary ">{uiText.label}</h4>

      <ul className="flex flex-wrap gap-2">
        {(options ?? []).map((option) => {
          const isCustom = typeof option !== "string";
          const title = isCustom ? option.title : option;
          const current = singleSelect
            ? (currentSelection as string)
            : (currentSelection as string[]);

          const isSelected = singleSelect
            ? title === current
            : currentSelection.includes(title);

          const bgColor = colorFromOptionHash
            ? getSeriesColor(
                hashStringToRange(title, 30),
                highContrast ? GRAPHS_CONTRAST_COLOR_PALETTE : undefined,
              )
            : undefined;
          const textColor = bgColor ? getContrastColor(bgColor) : undefined;

          return (
            <li key={`selectorBtn_${title}`}>
              <Button
                variant={isSelected ? "default" : "outline"}
                style={
                  colorFromOptionHash
                    ? {
                        backgroundColor: bgColor,
                        borderColor: bgColor,
                        color: textColor,
                      }
                    : undefined
                }
                className={cn(
                  "w-full h-auto min-h-9 whitespace-normal wrap-break-word text-center flex items-center justify-center gap-1.5",
                  singleSelect && isSelected ? "" : "hover:cursor-pointer",
                  "opacity-100! border! border-primary py-1 px-4",
                )}
                onClick={() => updateCurrent(title)}
                aria-pressed={isSelected}
                disabled={singleSelect ? isSelected : false}
              >
                <div className="flex flex-col">
                  <span>{title}</span>
                  {isCustom && option.subtitle && (
                    <span className="italic">{option.subtitle}</span>
                  )}
                </div>
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
