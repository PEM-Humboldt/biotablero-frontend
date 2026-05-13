import { ThumbsUp } from "lucide-react";
import { useState } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";
import { useUserCTX } from "@hooks/UserContext";

import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

import {
  makeLikeStatusMsg,
  likeMessages,
} from "pages/monitoring/ui/likeButton/statusMessage";

export function LikeButton<
  T extends { iLikedIt?: boolean; likes: number; id: number },
>({
  source,
  likeHandler,
  disabled,
  className,
  updater,
}: {
  source: T;
  disabled?: boolean;
  className?: string;
  likeHandler: (id: number) => Promise<unknown>;
  updater?: () => Promise<void> | void;
}) {
  const { user } = useUserCTX();
  const [errors, setErrors] = useState<string[]>([]);
  const [iLikeIt, setILikeIt] = useState(!!source.iLikedIt);

  const handleLike = async () => {
    setErrors([]);
    const res = await likeHandler(source.id);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }
    setILikeIt(true);

    if (updater) {
      void updater();
    }
  };

  const isReadOnly = !user || disabled || iLikeIt;

  return isReadOnly ? (
    <div
      className={cn(
        "py-2 px-3 min-h-9 flex gap-2 text-primary font-medium items-center",
        className,
      )}
      title={!user ? likeMessages.noUser : undefined}
    >
      <ThumbsUp aria-hidden="true" className="size-5" strokeWidth={2} />
      <span className="text-sm">
        {!user
          ? source.likes
          : makeLikeStatusMsg(iLikeIt, source.likes, disabled ?? false)}
      </span>
    </div>
  ) : (
    <div className={cn("h-8 flex items-center gap-1", className)}>
      <ErrorsList errorItems={errors} />

      <Button
        variant="ghost"
        onClick={() => void handleLike()}
        title={likeMessages.btn.title}
      >
        <ThumbsUp aria-hidden="true" className="size-5" strokeWidth={2} />
        <span aria-hidden="true">{likeMessages.btn.label}</span>
        <span className="sr-only">{likeMessages.btn.sr}</span>
      </Button>
    </div>
  );
}
