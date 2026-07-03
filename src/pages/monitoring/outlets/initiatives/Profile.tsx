import { LOCALE } from "@config/monitoring";

import { Stats } from "pages/monitoring/outlets/initiatives/profile/Stats";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";

import backgroundImage from "pages/home/assets/biotablero-slider.webp";
import {
  Binoculars,
  GoalIcon,
  type LucideIcon,
  MapPinned,
  SquareUser,
} from "lucide-react";

export function Profile() {
  const { initiativeInfo } = useInitiativeCTX();

  if (!initiativeInfo) {
    return null;
  }

  const creationDateObj = new Date(initiativeInfo.creationDate);
  const datetime = `${creationDateObj.getFullYear()}-${String(creationDateObj.getMonth() + 1)}`;
  const renderDate = creationDateObj.toLocaleDateString(LOCALE, {
    month: "long",
    year: "numeric",
  });

  const initiativeLocations = initiativeInfo.locations
    .map((l) => {
      const municipality = l.location.name ? `, ${l.location.name}` : "";
      const locality = l.locality ? ` - ${l.locality}` : "";
      const department = l.location?.parent ? l.location.parent.name : "";

      return `${department}${municipality}${locality}`;
    })
    .join(" | ");

  return (
    <div className="flex flex-col h-full md:flex-row-reverse">
      <div className="w-full">
        <div
          className="relative w-full h-[120px] md:h-[260px] bg-primary"
          style={{
            ...(initiativeInfo?.bannerUrl
              ? { backgroundImage: `url('${initiativeInfo?.bannerUrl}')` }
              : {}),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-2 md:top-6 right-2 md:right-6">
            <JoinInitiativeRequestButton />
          </div>
        </div>

        <main className="w-full space-y-4 lg:space-y-8">
          <div className="flex gap-2 max-w-[1200px] mx-auto p-4 md:p-8">
            <Binoculars
              className="size-12 text-accent min-w-10"
              strokeWidth={1.5}
            />

            <header>
              <h3 className="flex flex-col text-5xl uppercase m-0">
                {initiativeInfo.shortName}
                <div className="text-lg normal-case font-normal no-underline">
                  {initiativeInfo.name}
                </div>
              </h3>

              <div className="flex flex-col text-grey-dark">
                <div title="Participantes">
                  {initiativeInfo.users
                    .map((u) => u.externalData.fullName)
                    .join(", ")}
                </div>
                <div>
                  <time title="Fecha de registro" dateTime={datetime}>
                    Desde {renderDate}
                  </time>{" "}
                  <address title="Ubicación" className="not-italic inline">
                    // {initiativeLocations}
                  </address>
                </div>
              </div>

              <Stats />
            </header>
          </div>

          <div
            className="relative w-full h-[120px] md:h-[260px] bg-primary bg-cover bg-center"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          >
            <div className="absolute inset-0 bg-primary mix-blend-color" />
            graph
          </div>

          <TextBlock
            title="¿Quiénes somos?"
            text={initiativeInfo.description}
            Icon={SquareUser}
          />

          <TextBlock
            title="¿Dónde estamos?"
            text={initiativeInfo.baseline}
            Icon={MapPinned}
          />

          <TextBlock
            title="¿Cuál es nuestro objetivo?"
            text={initiativeInfo.objective}
            Icon={GoalIcon}
          />
        </main>
      </div>
      <div className="bg-accent h-full min-h-[300px] w-full min-w-[250px] md:max-w-[500px]">
        mapa
      </div>
    </div>
  );
}

function TextBlock({
  title,
  text,
  Icon,
}: {
  title: string;
  text?: string;
  Icon: LucideIcon;
}) {
  if (!text) {
    return null;
  }

  const parragraphs = text.split("\n");
  return (
    <div className="flex gap-2 max-w-[1200px] mx-auto px-4 md:px-8">
      <Icon
        className="size-[34px] -translate-y-1 text-accent min-w-10"
        strokeWidth={1.5}
      />
      <div>
        <h4 className="text-3xl font-bold">{title}</h4>
        {parragraphs.map((par) => (
          <p className="max-w-[75ch]">{par}</p>
        ))}
      </div>
    </div>
  );
}
