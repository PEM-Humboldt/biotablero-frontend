import { ODataSearchBar } from "@composites/ODataSearchBar";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { searchBarItems } from "pages/monitoring/outlets/initiatives/territoryStories/tsSearchBar/layout/searchBarItems";
import { Button } from "@ui/shadCN/component/button";
import { useState } from "react";
import { cn } from "@ui/shadCN/lib/utils";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { useUserCTX } from "@hooks/UserContext";
import {
  uiElement,
  orderStateSecuence,
} from "pages/monitoring/outlets/initiatives/territoryStories/layout/searchBarUI";

export function TSSearchBar({ className }: { className: string }) {
  const { user } = useUserCTX();
  const { setStorysSearchParams } = useTerritoryStorysCTX();
  const { userStateInInitiative } = useInitiativeCTX();
  const [orderDate, setOrderDate] = useState(0);
  const [myStories, setMyStories] = useState(false);

  const isUserInInitiative = [
    UserStateInInitiative.USER_PARTICIPANT,
    UserStateInInitiative.USER_LEADER,
    UserStateInInitiative.USER_VIEWER,
  ].includes(userStateInInitiative);

  const currentSortKey = orderStateSecuence[orderDate];
  const currentDateSort =
    currentSortKey === "none" ? uiElement.none : uiElement.sort[currentSortKey];

  const DateSortIcon = currentDateSort.icon;

  const currentUserFilter = myStories
    ? uiElement.userFilter.enabled
    : uiElement.userFilter.disabled;

  const UserFilterIcon = currentUserFilter.icon;

  const handleOnChangeOrder = () => {
    const nextIndex = (orderDate + 1) % 3;
    const nextValue = orderStateSecuence[nextIndex];

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
    <div className={cn("flex gap-2 items-end", className)}>
      <ODataSearchBar
        components={searchBarItems}
        setSearchParams={setStorysSearchParams}
        filterInjection={filterByMyUser}
        className="p-0 gap-0 m-0 w-1/2 min-w-[250px] shrink-0"
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
