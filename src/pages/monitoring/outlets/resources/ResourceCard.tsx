import { Link, useParams } from "react-router";

import { cn } from "@ui/shadCN/lib/utils";

import type { MonitoringResourceShort } from "pages/monitoring/types/odataResponse";
import { ExternalLink, FileDown, type LucideIcon } from "lucide-react";
import { ResourceTagsRender } from "pages/monitoring/outlets/resources/ui/ResourceTagsRender";
import { LikeResourceButton } from "pages/monitoring/outlets/resources/ui/LikeResourseButton";
import { uiText } from "pages/monitoring/outlets/resources/layout/uiText";

export function ResourceCard({
  resource,
}: {
  resource: MonitoringResourceShort;
}) {
  const { resourceId } = useParams();

  const lastUpdate = new Date(resource.publicationDate);
  const isoDate = lastUpdate.toISOString().split("T")[0];
  const renderDate = lastUpdate.toLocaleDateString();

  const tags = resource.tags.reduce<Record<number, string[]>>((all, tag) => {
    if (!all[tag.tag.category.id]) {
      all[tag.tag.category.id] = [];
    }
    if (tag.tag?.name) {
      all[tag.tag.category.id].push(tag.tag.name);
    }
    return all;
  }, {});

  return (
    <div
      className={cn(
        "isolate flex flex-col gap-4 justify-between relative overflow-hidden shadow-xl transition-all border border-transparent rounded-2xl p-4 pb-3 lg:p-6 lg:pb-4",
        "hover:scale-107 hover:shadow-sm hover:border-primary",
        resourceId && Number(resourceId) === resource.id
          ? "bg-primary/10 hover:scale-100 hover:border-transparent hover:shadow-xl"
          : "",
      )}
    >
      <div>
        <header className="mb-4">
          <h4 className="text-2xl mb-0">{resource.name}</h4>
          <span className="sr-only">
            {uiText.resourseMadeUnderInitiativePrefixSr}
          </span>
          <span className="text-sm italic">
            {resource.initiative?.name ?? ""}
          </span>
        </header>

        <time
          dateTime={isoDate}
          aria-label={`${uiText.resourcePublicationDatePrefixSr}${renderDate}`}
          className="absolute top-0 right-6 bg-primary text-primary-foreground text-sm px-2 rounded-b"
        >
          {renderDate}
        </time>

        <div className="space-y-2">
          <span className="sr-only">{uiText.tagsTitle.all}</span>
          <ResourceTagsRender
            tags={tags[3]}
            srTitle={uiText.tagsTitle.BiologicalGroup}
            className="[&_li]:bg-blue-200 [&_li]:text-blue-800 font-normal"
          />
          <ResourceTagsRender
            tags={tags[4]}
            srTitle={uiText.tagsTitle.ecosystem}
            className="[&_li]:bg-green-100 [&_li]:text-green-800 font-normal"
          />
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <section className="relative flex gap-4">
          <h5 className="sr-only">{uiText.smallCard.attachments.title}</h5>
          <ResourceAttachmentsCounter
            amount={resource.totalFiles}
            icon={FileDown}
            srText={uiText.smallCard.attachments.files}
          />
          <ResourceAttachmentsCounter
            amount={resource.totalLinks}
            icon={ExternalLink}
            srText={uiText.smallCard.attachments.links}
          />
        </section>

        <LikeResourceButton
          resource={resource}
          disabled={true}
          className="p-0"
        />
      </div>

      {(resourceId === undefined || Number(resourceId) !== resource.id) && (
        <Link
          to={`/Monitoreo/Recursos/${resource.id}`}
          className="absolute inset-0 bg-transparent cursor-pointer"
        >
          <span className="sr-only">{uiText.smallCard.gotoResource}</span>
        </Link>
      )}
    </div>
  );
}

function ResourceAttachmentsCounter({
  amount,
  icon: Icon,
  srText,
}: {
  amount?: number;
  icon: LucideIcon;
  srText: string;
}) {
  if (!amount || amount === 0) {
    return null;
  }

  return (
    <div
      className="flex items-center gap-1 text-primary"
      aria-hidden="false"
      title={srText}
    >
      <span className="font-medium">{amount}</span>
      <Icon aria-hidden="true" className="size-5" />
      <span className="sr-only">{srText}</span>
    </div>
  );
}
