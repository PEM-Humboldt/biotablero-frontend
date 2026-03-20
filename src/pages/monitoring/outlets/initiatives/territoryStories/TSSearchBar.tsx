import { ODataSearchBar } from "@composites/ODataSearchBar";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { searchBarItems } from "pages/monitoring/outlets/initiatives/territoryStories/tsSearchBar/layout/searchBarItems";
import { Button } from "@ui/shadCN/component/button";
import { useState } from "react";
import { Calendar1, CalendarArrowDown, CalendarArrowUp } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";

const orderState = ["none", "desc", "asc"] as const;

const orderConfigs = {
  none: {
    label: "",
    title: "Del más reciente al más antíguo",
    sr: "Ordenar del relato más reciente al más antíguo",
    icon: Calendar1,
  },
  desc: {
    label: "",
    title: "Del más antíguo al más reciente",
    sr: "Ordenar del relato más antíguo al más reciente",
    icon: CalendarArrowDown,
  },
  asc: {
    label: "",
    title: "Quitar orden",
    sr: "Quitar el orden",
    icon: CalendarArrowUp,
  },
};

export function TSSearchBar() {
  const [orderDate, setOrderDate] = useState(0);
  const { setStorysSearchParams } = useTerritoryStorysCTX();

  const handleOnChangeOrder = () => {
    const nextIndex = (orderDate + 1) % 3;
    const nextValue = orderState[nextIndex];

    setOrderDate(nextIndex);

    setStorysSearchParams((oldParams) => {
      const { orderby: _, ...otherParams } = oldParams;

      if (nextValue === "none") {
        return otherParams;
      }

      return { ...otherParams, orderby: `creationDate ${nextValue}` };
    });
  };

  const current = orderConfigs[orderState[orderDate]];
  const Icon = current.icon;

  return (
    <div className="flex gap-2 items-end px-4 py-2 bg-grey">
      <ODataSearchBar
        components={searchBarItems}
        setSearchParams={setStorysSearchParams}
        className="p-0 flex-1 gap-0 m-0"
      />
      <Button
        variant={
          orderState[orderDate] === "none" ? "outline" : "outline_destructive"
        }
        onClick={handleOnChangeOrder}
        title={current.title}
        className={cn(orderState[orderDate] === "none" ? "border-input" : "")}
        size={current.label === "" ? "icon" : "default"}
      >
        <span className="sr-only">{current.sr}</span>
        {current.label}
        <Icon />
      </Button>
    </div>
  );
}
