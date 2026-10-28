import { Link } from "react-router";
import type { ODataTag } from "pages/monitoring/types/odataResponse";
import { Button } from "@ui/shadCN/component/button";
import type { LucideIcon } from "lucide-react";
import type { ObservationVersion } from "pages/monitoring/types/observations";
import { TagsGroupsRender } from "pages/monitoring/ui/TagsGroupsRender";

export function DataSheetSmallCard({
  title,
  tags,
  location,
  bottonLeftInfo,
  link,
}: {
  title: string;
  tags?: Omit<ODataTag, "categoryName">[];
  location?: string;
  bottonLeftInfo?: Date | ObservationVersion;
  link: {
    href: string;
    label?: string;
    icon: LucideIcon;
    title: string;
    sr?: string;
  };
}) {
  const Icon = link.icon;

  return (
    <div className="bg-background p-2 rounded-lg outline outline-transparent hover:outline-primary transition-colors duration-300">
      <h5 className="text-base/5 font-normal mb-0 px-2 text-balance">
        {title}
      </h5>

      <TagsGroupsRender
        tags={tags ?? []}
        groupId={title.replaceAll(" ", "")}
        colorIndexOffset={3}
        stylesFor={{ group: "m-1 mt-2" }}
      />

      {location && location !== "" && (
        <address className="px-2">{location}</address>
      )}

      <hr className="border-t border-grey-light mt-2" />

      <div className="px-2 flex justify-between items-center *:text-sm *:m-0">
        {bottonLeftInfo instanceof Date ? (
          <time dateTime={bottonLeftInfo.toISOString().split("T")[0]}>
            Desde {bottonLeftInfo.toLocaleDateString()}
          </time>
        ) : (
          bottonLeftInfo?.creationDate && (
            <time
              dateTime={
                new Date(bottonLeftInfo.creationDate)
                  .toISOString()
                  .split("T")[0]
              }
            >
              Actualizado el{" "}
              {new Date(bottonLeftInfo.creationDate).toLocaleDateString()}
            </time>
          )
        )}

        <Button variant="ghost-clean" size="sm" className="px-0! mx-0" asChild>
          <Link
            to={link.href}
            title={link.title}
            aria-label={link.sr ?? undefined}
          >
            {link.label}
            <Icon className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
