// import { type ChangeEvent, useEffect, useState } from "react";
//
// import { getInitiatives } from "pages/monitoring/api/services/initiatives";
// import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
// import type { ODataInitiative } from "pages/monitoring/types/odataResponse";
// import {
//   NativeSelect,
//   NativeSelectOption,
// } from "@ui/shadCN/component/native-select";
// import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";
//
// import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
//
// import { TerritoryStoryForm } from "pages/monitoring/outlets/territoryStory/FormTS";

// export function InitiativeSelector() {
//   const [allInitiatives, setAllInitiatives] = useState<
//     ODataInitiative["value"]
//   >([]);
//   const { setInitiative } = useInitiativeCTX();
//
//   useEffect(() => {
//     const fetchInitiatives = async () => {
//       const initiatives = await getInitiatives({ orderby: "id desc" });
//       if (isMonitoringAPIError(initiatives)) {
//         setAllInitiatives([]);
//         return;
//       }
//
//       setAllInitiatives(initiatives.value);
//     };
//     void fetchInitiatives();
//   }, []);
//
//   const handleInitiativeChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     void setInitiative(
//       e.target.value !== "" ? Number(e.target.value) : undefined,
//     );
//   };
//
//   return (
//     <div className="absolute p-4 w-[25%] h-[50%] bg-background top-19 left-13 z-10 rounded-lg flex flex-col gap-4">
//       <NativeSelect onChange={handleInitiativeChange}>
//         <NativeSelectOption value={0}>
//           Selecciona una iniciativa
//         </NativeSelectOption>
//         {allInitiatives.map((initiative) => (
//           <NativeSelectOption key={initiative.id} value={initiative.id}>
//             nombre:{initiative.name} id:{initiative.id}
//           </NativeSelectOption>
//         ))}
//       </NativeSelect>
//
//       <JoinInitiativeRequestButton />
//     </div>
//   );

// return <TerritoryStoryForm />;
// }
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ui/shadCN/component/tabs";
import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { Selector } from "pages/monitoring/outlets/initiatives/Selector";
import { ReactNode, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import {
  ChartBar,
  LucideIcon,
  MessageSquareText,
  SquareUserRound,
  UsersRound,
} from "lucide-react";
import { FormTS } from "./territoryStory/FormTS";

const tabs = new Map<
  string,
  { label: string; component: ReactNode; icon: LucideIcon }
>([
  [
    "profile",
    {
      label: "Perfil",
      component: <div>carajo</div>,
      icon: SquareUserRound,
    },
  ],
  [
    "indicators",
    {
      label: "Indicadores",
      component: <div>carajo</div>,
      icon: ChartBar,
    },
  ],
  [
    "storys",
    {
      label: "Relatos del territorio",
      component: FormTS,
      icon: MessageSquareText,
    },
  ],
  [
    "collaborators",
    {
      label: "colaboradores",
      component: <div>carajo</div>,
      icon: UsersRound,
    },
  ],
]);

export function Initiatives() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const { initiativeInfo } = useInitiativeCTX();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.HEADER_NAMES,

      newHeader: {
        title: initiativeInfo?.name ?? "",
        subtitle: "",
      },
    });
  }, [layoutDispatch, initiativeInfo]);

  return (
    // TODO: El contexto debe tomar el id de la iniciativa de la url
    <div className="flex flex-col w-full">
      <Selector />
      <Tabs defaultValue={[...tabs][2][0]}>
        <TabsList className="w-full h-auto flex *:flex-1 bg-accent p-0! m-0!">
          {[...tabs].map(([key, value]) => (
            <TabsTrigger
              key={`tTrigger_${key}`}
              value={key}
              className="text-lg border-b-2 border-b-primary data-[state=active]:border-b-accent data-[state=active]:bg-primary data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-background bg-grey-light text-primary data-[state=active]:text-background justify-start p-0 cursor-pointer data-[state=active]:cursor-auto"
            >
              <value.icon
                className="bg-primary/20 p-2 mr-2 size-9 "
                aria-hidden="true"
              />
              {value.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {[...tabs].map(([key, value]) => (
          <TabsContent key={`tContent_${key}`} value={key}>
            <value.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
