import { parseSimpleMarkdown } from "@utils/textParser";

interface ShortInfoTypes {
  className?: string;
  description: string;
}

export function ShortInfo({
  description = "",
  className = "hidden",
}: ShortInfoTypes) {
  return (
    <div className={`${className}-${true}`}>
      {description === "" ? "Cargando..." : parseSimpleMarkdown(description)}
    </div>
  );
}
