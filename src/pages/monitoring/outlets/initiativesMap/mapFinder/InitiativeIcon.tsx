import { Binoculars } from "lucide-react";

export function InitiativeIcon() {
  return (
    <div className="w-full aspect-square rounded-full bg-primary overflow-hidden">
      <Binoculars
        className="w-full h-full m-0 text-background scale-70"
        strokeWidth={1}
      />
    </div>
  );
}
