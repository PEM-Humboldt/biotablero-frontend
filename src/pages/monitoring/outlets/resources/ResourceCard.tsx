import type { MonitoringResource } from "pages/monitoring/types/odataResponse";
import { cn } from "@ui/shadCN/lib/utils";
import { ExternalLink, FileDown, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { ResourceTagsRender } from "pages/monitoring/outlets/resources/ui/ResourceTagsRender";
import { LikeResourceButton } from "pages/monitoring/outlets/resources/ui/LikeResourseButton";

export function ResourceCard({ resource }: { resource: MonitoringResource }) {
  const lastUpdate = new Date(resource.publicationDate);
  const isoDate = lastUpdate.toISOString().split("T")[0];
  const renderDate = lastUpdate.toLocaleDateString();

  const tags = resource.tags.reduce<Record<number, string[]>>((all, tag) => {
    if (!all[tag.tag.category.id]) {
      all[tag.tag.category.id] = [];
    }
    all[tag.tag.category.id].push(tag.tag.name);
    return all;
  }, {});

  return (
    <div
      className={cn(
        "isolate relative overflow-hidden shadow-xl transition-all space-y-2 bg-background border border-grey rounded-2xl p-4 lg:p-6",
        "hover:scale-107 hover:shadow-sm hover:border-primary",
      )}
    >
      <h4>{resource.name}</h4>
      <div>
        <span className="sr-only">Realizado por la iniciativa</span>{" "}
        {resource.initiativeId}
      </div>
      <div className="absolute top-0 right-6 bg-primary text-primary-foreground text-sm px-2 rounded-b">
        <span className="sr-only">Fecha de publicación</span>
        <time dateTime={isoDate}>{renderDate}</time>
      </div>

      <ResourceTagsRender
        tags={tags[3]}
        srTitle="Grupo biológico"
        className="[&_li]:bg-blue-200 [&_li]:text-blue-800 font-normal"
      />
      <ResourceTagsRender
        tags={tags[4]}
        srTitle="Ecosistemas estratégicos"
        className="[&_li]:bg-green-100 [&_li]:text-green-800 font-normal"
      />

      <section className="relative flex gap-4">
        <h5 className="sr-only">Este recuros contiene</h5>
        <ResourceAttachmentsCounter
          amount={resource.files.length}
          icon={FileDown}
          srText="Archivos para descargar"
        />
        <ResourceAttachmentsCounter
          amount={resource.links.length}
          icon={ExternalLink}
          srText="Enlaces externos"
        />
      </section>

      <LikeResourceButton resource={resource} disabled={true} />

      <Link
        to={`/Monitoreo/Recursos/${resource.id}`}
        className="absolute inset-0 bg-transparent cursor-pointer"
      >
        <span className="sr-only">Ir al recurso</span>
      </Link>
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
      <Icon aria-hidden="true" className="size-6" />
      <span className="sr-only">{srText}</span>
    </div>
  );
}
