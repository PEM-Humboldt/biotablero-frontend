import { useState } from "react";

export function InitiativeTagForm({
  initiativeId,
}: {
  initiativeId: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-muted">
      HELLO
    </div>
  );
}