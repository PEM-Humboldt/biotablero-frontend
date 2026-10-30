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
import { LikeResourceButton } from "pages/monitoring/outlets/resources/ui/LikeResourseButton";
import { uiText } from "pages/monitoring/outlets/resources/layout/uiText";
import { TagsGroupsRender } from "pages/monitoring/ui/TagsGroupsRender";

type UnifiedAttachment = ResourceAttachment & {
  type: "file" | "link";
};

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

  const attachments: UnifiedAttachment[] = [
    ...(resource.files ?? []).map((file) => ({
      ...file,
      type: "file" as const,
    })),
    ...(resource.links ?? []).map((link) => ({
      ...link,
      type: "link" as const,
    })),
  ];

  return (
    <article className="relative w-full p-4 pt-6 lg:p-8 bg-background border-2 border-primary rounded-xl shadow-xl mb-4 lg:w-[75%]">
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
          <span className="italic">{resource.initiative?.name ?? ""}</span>
        </div>

        <div className="absolute top-0 right-4 bg-primary text-primary-foreground text-sm font-normal px-2 rounded-b">
          <span className="sr-only">
            {uiText.resourcePublicationDatePrefixSr}
          </span>
          <time dateTime={isoDate}>{renderDate}</time>
        </div>

        <TagsGroupsRender
          tags={resource.tags.map((t) => t.tag)}
          groupId={resource.name.replaceAll(" ", "")}
          stylesFor={{ group: "pt-2 pb-6" }}
          colorIndexOffset={3}
        />
      </header>

      <div className="flex flex-col lg:flex-row w-full gap-4 mb-4">
        <div className="flex-1">
          <h4 className="text-primary italic mb-0">
            {uiText.resourceDesciptionTitle}
          </h4>
          <p className="text-base xl:text-lg max-w-[65ch] m-0">
            {resource.description}
          </p>
        </div>

        <ResourceAttachments
          title={uiText.attachmentsTitle.files}
          attachments={attachments}
          className="flex-1 xl:border-l xl:border-l-grey-light xl:pl-4"
        />
      </div>

      <LikeResourceButton resource={resource} updateResorce={updateResource} />
    </article>
  );
}

function ResourceAttachments({
  title,
  attachments,
  className,
}: {
  title: string;
  attachments: UnifiedAttachment[];
  className?: string;
}) {
  return !attachments || attachments.length === 0 ? null : (
    <section className={className}>
      <h4 className="text-primary italic mb-0">{title}</h4>
      <ul className="space-y-1">
        {attachments.map((att, i) => {
          const Icon = getAttachmentIcon(att);
          const isLink = att.type === "link";
          const extension = !isLink
            ? att.url.split(".").pop()?.toUpperCase()
            : "";
          const cleanName = `${att.name.replace(/\s+/g, "_")}.${extension}`;

          return (
            <li
              key={`resource_${att.type}_${att.id}`}
              className={cn(
                "relative group flex gap-2 items-center justify-between hover:bg-accent/10 px-4 rounded-lg py-1",
                i % 2 ? "bg-muted/50" : "",
              )}
            >
              <div className="group-hover:underline min-w-0 truncate">
                {att.name}
              </div>

              <div className="flex gap-1 items-center text-accent text-sm font-normal">
                <span>{isLink ? "Visitar" : `Descargar ${extension}`}</span>
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
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const getAttachmentIcon = (att: UnifiedAttachment) => {
  if (att.type === "link") {
    return ExternalLink;
  }

  const icons: Record<string, LucideIcon> = {
    pdf: FileText,
    pptx: FileImage,
    xlsx: FileSpreadsheet,
    csv: FileSpreadsheet,
  };

  const fileExtension = att.url.split(".").pop()?.toLowerCase() || "";
  return icons[fileExtension] ?? FileIcon;
};
