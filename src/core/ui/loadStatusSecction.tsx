import { cn } from "@ui/shadCN/lib/utils";

export type LoadStatusMsgBarProp = {
  message: string | null;
  type: "normal" | "error";
};

export function LoadStatusMsgBar({ message, type }: LoadStatusMsgBarProp) {
  return !message ? null : (
    <div
      className={cn(
        "w-full p-8 text-3xl text-center rounded-lg",
        type === "error"
          ? "bg-secondary text-secondary-foreground"
          : "bg-muted text-muted-foreground",
      )}
    >
      {message}
    </div>
  );
}
