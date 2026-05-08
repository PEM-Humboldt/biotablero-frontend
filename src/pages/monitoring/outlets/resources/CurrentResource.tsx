import {
  ExternalLink,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileIcon,
  type LucideIcon,
  CircleXIcon,
} from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";

import type {
  MonitoringResource,
  ResourceAttachment,
} from "pages/monitoring/types/odataResponse";
import { ResourceTagsRender } from "pages/monitoring/outlets/resources/ui/ResourceTagsRender";
import { LikeResourceButton } from "pages/monitoring/outlets/resources/ui/LikeResourseButton";
import { uiText } from "pages/monitoring/outlets/resources/layout/uiText";

export function CurrentResource({
  resource,
  updateResource,
  closeCurrentResource,
}: {
  resource: MonitoringResource | null;
  updateResource: () => Promise<void>;
  closeCurrentResource: () => void;
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

  const hasFiles = resource.files.length > 0;
  const hasLinks = resource.links.length > 0;
  const listsCount = [hasFiles, hasLinks].filter(Boolean).length;

  const widthClass = {
    0: "lg:w-1/2",
    1: "lg:w-[75%]",
    2: "lg:w-full",
  }[listsCount as 0 | 1 | 2];

  return (
    <article
      className={cn(
        "relative w-full p-8 bg-background border-2 border-primary rounded-4xl shadow-xl mb-4",
        widthClass,
      )}
    >
      <header>
        <div className="flex gap-2 justify-between">
          <h3 className="text-primary text-5xl mb-0">{resource.name}</h3>
          <Button
            title={uiText.currentResource.closeBtn.title}
            variant="ghost"
            size="icon-lg"
            onClick={closeCurrentResource}
            className="text-accent"
          >
            <span className="sr-only">
              {uiText.currentResource.closeBtn.sr}
            </span>
            <CircleXIcon className="size-8" aria-hidden="true" />
          </Button>
        </div>

        <div>
          <span className="sr-only">
            {uiText.resourseMadeUnderInitiativePrefixSr}
          </span>
          <span className="italic">{resource.initiative.name}</span>
        </div>

        <div className="absolute top-0 right-8 bg-primary text-primary-foreground text-sm px-2 rounded-b">
          <span className="sr-only">
            {uiText.resourcePublicationDatePrefixSr}
          </span>
          <time dateTime={isoDate}>{renderDate}</time>
        </div>

        <div className="flex gap-2 pt-2 pb-6">
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
      </header>

      <div className="flex flex-wrap w-full gap-4 [&_h4]:text-primary [&_h4]:italic [&_h4]:mb-0">
        <div className="flex-2 min-w-[350px]">
          <h4>{uiText.resourceDesciptionTitle}</h4>
          <p className="text-lg">{resource.description}</p>
        </div>

        <ResourceAttachments
          type="files"
          title={uiText.attachmentsTitle.files}
          attachments={resource.files}
          className="flex-1 min-w-[350px]"
        />

        <ResourceAttachments
          type="links"
          title={uiText.attachmentsTitle.files}
          attachments={resource.links}
          className="flex-1 min-w-[350px]"
        />
      </div>
      <LikeResourceButton resource={resource} updateResorce={updateResource} />
    </article>
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
    <section className={cn("border-l border-l-grey-light pl-4", className)}>
      <h4>{title}</h4>
      <ul className="space-y-1">
        {attachments.map((att, i) => {
          const Icon = icon(att.url);
          const isLink = type === "links";
          const extension =
            type === "files" ? att.url.split(".").pop()?.toLowerCase() : "";
          const cleanName = `${att.name.replace(/\s+/g, "_")}.${extension}`;

          return (
            <li
              key={`resource_${type}_${att.id}`}
              className={cn(
                "relative group flex gap-2 items-center justify-between hover:bg-accent/10 px-4 rounded-lg py-1",
                i % 2 ? "bg-muted/50" : "",
              )}
            >
              <div className="group-hover:underline">{att.name}</div>
              <div className="flex gap-1 items-center text-accent text-sm font-normal">
                <span>{isLink ? "Visitar" : "Descargar"}</span>
                <Icon size={18} />
              </div>

              <a
                href={att.url}
                className="absolute inset-0"
                target="_blank"
                rel={isLink ? "noopener noreferrer" : undefined}
                download={!isLink ? cleanName : undefined}
                title={
                  isLink
                    ? uiText.currentResource.attachmentAction.link(att.url)
                    : uiText.currentResource.attachmentAction.file(att.name)
                }
              ></a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
