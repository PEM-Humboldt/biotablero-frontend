import type {
  MonitoringResource,
  ResourceAttachment,
} from "pages/monitoring/types/odataResponse";
import { ResourceTagsRender } from "pages/monitoring/outlets/resources/ui/ResourceTagsRender";
import {
  ExternalLink,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@ui/shadCN/component/button";

export function CurrentResource({
  resource,
}: {
  resource: MonitoringResource | null;
}) {
  if (!resource) {
    return null;
  }

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
    <div className="p-4">
      <article className="relative max-w-[1200px] p-8 bg-background border-2 border-primary rounded-2xl shadow-xl mb-8">
        <h3 className="text-primary text-5xl mb-0">{resource.name}</h3>
        <div>
          <span className="sr-only">Realizado por la iniciativa</span>{" "}
          {resource.initiativeId}
        </div>
        <div className="absolute top-0 right-6 bg-primary text-primary-foreground text-sm px-2 rounded-b">
          <span className="sr-only">Fecha de publicación</span>
          <time dateTime={isoDate}>{renderDate}</time>
        </div>

        <div className="flex gap-2 py-4">
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
        </div>

        <hr />

        <div className="flex flex-wrap w-fit max-w-full gap-8 *:flex-1">
          <p className="min-w-[350px]">{resource.description}</p>

          <ResourceAttachments
            type="files"
            title="Archivos adjuntos"
            attachments={resource.files}
            className="min-w-[250px]"
          />
          <ResourceAttachments
            type="links"
            title="Enlaces relacionados"
            attachments={resource.links}
            className="min-w-[250px]"
          />
        </div>
      </article>
    </div>
  );
}

function ResourceAttachments({
  type,
  title,
  attachments,
  className,
}: {
  type: "files" | "links";
  title: string;
  attachments: ResourceAttachment[];
  className?: string;
}) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const icon = (url: string) => {
    if (type === "links") {
      return ExternalLink;
    }

    const icons: Record<string, LucideIcon> = {
      pdf: FileText,
      pptx: FileImage,
      xlsx: FileSpreadsheet,
      csv: FileSpreadsheet,
    };

    const fileExtension = url.split(".").pop()?.toLowerCase() || "";
    return icons[fileExtension] ?? FileIcon;
  };

  return (
    <section>
      <h4 className="sr-only">{title}</h4>
      <ul>
        {attachments.map((att) => {
          const Icon = icon(att.url);
          const isLink = type === "links";
          const extension =
            type === "files" ? att.url.split(".").pop()?.toLowerCase() : "";
          const cleanName = `${att.name.replace(/\s+/g, "_")}.${extension}`;

          return (
            <li className="flex gap-2 items-center">
              <Button asChild variant="ghost">
                <a
                  href={att.url}
                  target="_blank"
                  rel={isLink ? "noopener noreferrer" : undefined}
                  download={!isLink ? cleanName : undefined}
                  title={
                    isLink ? `Visitar ${att.url}` : `Descargar ${att.name}`
                  }
                >
                  <Icon size={18} />
                  <span className="sr-only">
                    {isLink ? "Visitar" : "Descargar"}
                  </span>
                  {att.name}
                </a>
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
