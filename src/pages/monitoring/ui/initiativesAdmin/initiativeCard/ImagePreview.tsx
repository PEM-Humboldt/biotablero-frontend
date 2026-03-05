import { cn } from "@ui/shadCN/lib/utils";
import { ImageOff } from "lucide-react";

export function ImagePreview({
  title,
  imageUrl,
  altTxt,
  fallbackTxt,
}: {
  title: string;
  imageUrl?: string | File | null;
  altTxt: string;
  fallbackTxt: string;
}) {
  return (
    <div>
      {title}
      <div
        className={cn(
          "relative group mt-1 overflow-hidden rounded-xl border border-primary border-dashed bg-white h-[200px] transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
        )}
      >
        <div className="absolute inset-0 p-2 flex items-center justify-center pointer-events-none z-0">
          {imageUrl && typeof imageUrl === "string" ? (
            <img
              src={imageUrl}
              alt={altTxt}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageOff className="w-16 h-16 opacity-30 text-primary" />
              <span className="text-base text-primary">{fallbackTxt}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
