import { LOCALE } from "@config/monitoring";

import { Stats } from "pages/monitoring/outlets/initiatives/profile/Stats";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";
import { Button } from "@ui/shadCN/component/button";

import backgroundImage from "pages/home/assets/biotablero-slider.webp";
import {
  Binoculars,
  GoalIcon,
  Handshake,
  LinkIcon,
  type LucideIcon,
  MailIcon,
  MapPinned,
  SquareUser,
} from "lucide-react";
import { TagsRender } from "pages/monitoring/ui/TagsRender";
import { RelatedInitiatives } from "pages/monitoring/outlets/initiatives/profile/RelatedInitiatives";

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

  const ecosystems = initiativeInfo.tags
    .filter((t) => t.tag.category.name === "Ecosystem")
    .map((t) => t.tag.name);

  const politicalContextTags = initiativeInfo.tags.filter(
    (t) => t.tag.category.name === "PoliticalContext",
  );

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
            backgroundPosition: "left center",
          }}
        >
          <div className="absolute top-2 md:top-6 right-2 md:right-6">
            <JoinInitiativeRequestButton />
          </div>
        </div>

        <main className="w-full space-y-4 lg:space-y-8">
          <div className="flex gap-2 max-w-[1200px] mx-auto mt-4 py-4 md:py-8 px-4 md:px-8">
            <Binoculars
              className="size-[34px] text-accent min-w-10"
              strokeWidth={1.5}
            />

            <header className="flex-3">
              <h3 className="flex flex-col text-5xl uppercase m-0">
                {initiativeInfo.shortName}
                <div className="text-lg normal-case font-normal no-underline">
                  {initiativeInfo.name}
                </div>
              </h3>

              <div className="flex flex-col mb-4 text-grey-dark">
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

            <div className="flex-1 space-y-4 px-2 lg:px-4 [&_h4]:m-0 self-end">
              {initiativeInfo.contacts?.map((contact) => (
                <Button
                  key={`contactInfo_${contact.email}`}
                  variant="outline"
                  className="p-0"
                  asChild
                >
                  <a href={`mailto:${contact.email}`}>
                    <MailIcon />
                    Escríbenos
                  </a>
                </Button>
              ))}
              <div>
                <h4>Ecosistemas estratégicos</h4>
                <TagsRender
                  tags={ecosystems}
                  className="[&_li]:bg-green-100 [&_li]:text-green-800 font-normal"
                />
              </div>
              <div>
                <h4>Convenios vinculados</h4>
                {politicalContextTags.map((t) => (
                  <a
                    key={`politicalContextTag_${t.tag.id}`}
                    href={t.tag.url}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm whitespace-nowrap hover:text-accent hover:underline"
                  >
                    <LinkIcon className="size-3 text-accent" />
                    {t.tag.name}
                  </a>
                ))}
              </div>
            </div>
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

          <div className="flex gap-2 max-w-[1200px] mx-auto px-4 pb-4 md:px-8 md:pb-8">
            <Handshake
              className="size-[34px] -translate-y-1 text-accent min-w-10"
              strokeWidth={1.5}
            />
            <div className="pb-2 lg:pb-4">
              <h4 className="text-3xl font-bold">Iniciativas Relacionadas</h4>
              <RelatedInitiatives />
            </div>
          </div>
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
      <div className="pb-2 lg:pb-4 border-b border-grey-light">
        <h4 className="text-3xl font-bold">{title}</h4>
        {parragraphs.map((par, i) => (
          <p key={`title_${i}`} className="max-w-[75ch]">
            {par}
          </p>
        ))}
      </div>
    </div>
  );
}
