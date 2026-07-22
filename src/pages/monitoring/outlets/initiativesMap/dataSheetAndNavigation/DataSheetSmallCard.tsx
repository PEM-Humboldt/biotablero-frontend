import { Link } from "react-router";
import type { ODataTag } from "pages/monitoring/types/odataResponse";
import { TagsRender } from "pages/monitoring/ui/TagsRender";
import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";
import type { LucideIcon } from "lucide-react";
import { TAG_COLORS } from "@config/monitoring";

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
  bottonLeftInfo?: Date | string;
  link: {
    href: string;
    label?: string;
    icon: LucideIcon;
    title: string;
    sr?: string;
  };
}) {
  const tagsGrouped = (tags || []).reduce<Record<number, string[]>>(
    (all, tag) => {
      if (!all[tag.category.id]) {
        all[tag.category.id] = [];
      }
      all[tag.category.id].push(tag.name);

      return all;
    },
    {},
  );

  const Icon = link.icon;
  const prefix = title.replaceAll(" ", "");

  return (
    <div className="bg-background p-2 rounded-lg outline outline-transparent hover:outline-primary transition-colors duration-300">
      <h5 className="text-base/5 font-normal mb-0 px-2 text-balance">
        {title}
      </h5>
      {tags && Object.keys(tagsGrouped).length > 0 && (
        <div className="m-1 gap-2 space-y-2">
          {Object.values(tagsGrouped).map((group, i) => {
            const colorValues = TAG_COLORS[i % TAG_COLORS.length];
            const colorSet = `${colorValues.bg} ${colorValues.fg}`;

            return (
              <TagsRender
                key={`${prefix}_${group[i]}_${i}`}
                tags={group}
                srTitle="Etiquetas 1"
                className={cn(colorSet, "font-normal")}
              />
            );
          })}
        </div>
      )}

      {location && location !== "" && (
        <address className="px-2">{location}</address>
      )}

      <hr className="border-t border-grey-light mt-2" />

      <div className="px-2 flex justify-between items-center *:text-sm *:m-0">
        {bottonLeftInfo instanceof Date ? (
          <time dateTime={bottonLeftInfo.toISOString().split("T")[0]}>
            {bottonLeftInfo.toLocaleDateString()}
          </time>
        ) : (
          <span>{bottonLeftInfo}</span>
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
