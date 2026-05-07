import { cn } from "@ui/shadCN/lib/utils";

export function ResourceTagsRender({
  tags,
  srTitle,
  className,
}: {
  tags?: string[];
  srTitle: string;
  className?: string;
}) {
  if (!tags || !tags.length) {
    return null;
  }

  return (
    <section aria-label={srTitle} title={srTitle}>
      <h5 className="sr-only">{srTitle}</h5>
      <ul className={cn("flex flex-wrap gap-2", className)}>
        {tags.map((tag) => (
          <li key={`${srTitle}_${tag}`} className="rounded text-sm px-1">
            {tag}
          </li>
        ))}
      </ul>
    </section>
  );
}
