import { Binoculars, Handshake } from "lucide-react";
import { Stats } from "pages/monitoring/outlets/initiatives/profile/Stats";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { RelatedInitiatives } from "pages/monitoring/outlets/initiatives/profile/RelatedInitiatives";
import { MonitoringEventsGraph } from "pages/monitoring/outlets/initiatives/profile/MonitoringEventsGraph";
import { InitiativeMap } from "pages/monitoring/outlets/initiatives/profile/InitiativeMap";
import { Banner } from "pages/monitoring/outlets/initiatives/profile/Banner";
import { TagsAndContact } from "pages/monitoring/outlets/initiatives/profile/TasgsAndContact";
import { BasicInfo } from "pages/monitoring/outlets/initiatives/profile/BasicInfo";
import { profileTexts } from "pages/monitoring/outlets/initiatives/layout/profileTexts";

export function Profile() {
  const { initiativeInfo } = useInitiativeCTX();

  if (!initiativeInfo) {
    return null;
  }

  return (
    <div className="flex flex-col h-full lg:flex-row-reverse">
      <div className="w-full lg:flex-3">
        <Banner />

        <main className="w-full space-y-4 lg:space-y-8">
          <header className="flex gap-2 max-w-[1200px] mx-auto mt-4 py-4 md:py-8 px-4 md:px-8">
            <Binoculars
              className="size-[34px] text-accent min-w-10"
              strokeWidth={1.5}
            />

            <div className="flex-3 flex-wrap">
              <BasicInfo />
              <Stats />
            </div>

            <TagsAndContact />
          </header>

          <MonitoringEventsGraph />

          {profileTexts.map((textInfo) => {
            if (!textInfo.valueKey || !initiativeInfo[textInfo.valueKey]) {
              return null;
            }

            const parragraphs = initiativeInfo[textInfo.valueKey].split("\n");
            return (
              <div
                key={`textInfo_${textInfo.valueKey}`}
                className="flex gap-2 max-w-[1200px] mx-auto px-4 md:px-8"
              >
                <textInfo.Icon
                  className="size-[34px] -translate-y-1 text-accent min-w-10"
                  strokeWidth={1.5}
                />
                <div className="pb-2 lg:pb-4 border-b border-grey-light">
                  <h4 className="text-3xl font-bold">{textInfo.title}</h4>
                  {parragraphs.map((par, i) => (
                    <p
                      key={`textInfo_${textInfo.valueKey}_${i}`}
                      className="max-w-[75ch]"
                    >
                      {par}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}

          <RelatedInitiatives />
        </main>
      </div>

      <InitiativeMap />
    </div>
  );
}
