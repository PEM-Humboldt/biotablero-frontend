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
    <div className={`${className}-true markdown-ShortInfo pt-2 pb-4`}>
      {description === "" ? "Cargando..." : parseSimpleMarkdown(description)}
    </div>
  );
}
