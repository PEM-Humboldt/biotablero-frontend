import { ODataSearchBar } from "@composites/ODataSearchBar";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { searchBarItems } from "pages/monitoring/outlets/initiatives/territoryStories/tsSearchBar/layout/searchBarItems";
import { Button } from "@ui/shadCN/component/button";
import { useState } from "react";
import {
  Calendar1,
  CalendarArrowDown,
  CalendarArrowUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { useUserCTX } from "@hooks/UserContext";

const orderState = ["none", "desc", "asc"] as const;

const orderConfigs = {
  none: {
    label: "",
    title: "Del más reciente al más antíguo",
    sr: "Ordenar del relato más reciente al más antíguo",
    icon: Calendar1,
  },
  sort: {
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
  },
  userFilter: {
    enabled: {
      label: "",
      title: "mostrar los relatos de todos",
      sr: "mostrar los relatos de todos los participantes",
      icon: UserRound,
    },
    disabled: {
      label: "",
      title: "Mostrar solo mis relatos",
      sr: "Mostrar solo mis relatos",
      icon: UsersRound,
    },
  },
};

export function TSSearchBar() {
  const { user } = useUserCTX();
  const { setStorysSearchParams } = useTerritoryStorysCTX();
  const { userStateInInitiative } = useInitiativeCTX();
  const [orderDate, setOrderDate] = useState(0);
  const [myStories, setMyStories] = useState(false);

  const isUserInInitiative =
    userStateInInitiative === UserStateInInitiative.USER_PARTICIPANT ||
    userStateInInitiative === UserStateInInitiative.USER_LEADER;

  const currentSortKey = orderState[orderDate];
  const currentDateSort =
    currentSortKey === "none"
      ? orderConfigs.none
      : orderConfigs.sort[currentSortKey];

  const DateSortIcon = currentDateSort.icon;

  const currentUserFilter = myStories
    ? orderConfigs.userFilter.enabled
    : orderConfigs.userFilter.disabled;

  const UserFilterIcon = currentUserFilter.icon;

  const handleOnChangeOrder = () => {
    const nextIndex = (orderDate + 1) % 3;
    const nextValue = orderState[nextIndex];

    setOrderDate(nextIndex);

    setStorysSearchParams((oldParams) => {
      const { orderby: _, ...otherParams } = oldParams;
      if (nextValue === "none") {
        return { ...otherParams, skip: 0 };
      }

      return { ...otherParams, skip: 0, orderby: `creationDate ${nextValue}` };
    });
  };

  const filterByMyUser = myStories
    ? `authorUserName eq '${user?.username}'`
    : undefined;

  return (
    <div className="flex gap-2 items-end px-4 py-2 bg-grey">
      <ODataSearchBar
        components={searchBarItems}
        setSearchParams={setStorysSearchParams}
        filterInjection={filterByMyUser}
        className="p-0 flex-1 gap-0 m-0"
      />

      <Button
        variant={currentSortKey === "none" ? "outline" : "outline_destructive"}
        onClick={handleOnChangeOrder}
        title={currentDateSort.title}
        className={cn(currentSortKey === "none" ? "border-input" : "")}
        size={currentDateSort.label === "" ? "icon" : "default"}
      >
        <span className="sr-only">{currentDateSort.sr}</span>
        {currentDateSort.label}
        <DateSortIcon className="size-4" />
      </Button>

      {isUserInInitiative && (
        <Button
          variant={myStories ? "outline_destructive" : "outline"}
          onClick={() => setMyStories((prev) => !prev)}
          title={currentUserFilter.title}
          size={currentUserFilter.label === "" ? "icon" : "default"}
          className={cn(!myStories ? "border-input" : "")}
        >
          <span className="sr-only">{currentUserFilter.sr}</span>
          {currentUserFilter.label}
          <UserFilterIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}
