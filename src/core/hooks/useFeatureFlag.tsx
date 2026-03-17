import { useEffect, useState } from "react";
import isFlagEnabled from "@utils/isFlagEnabled";

export function useFeatureFlag(flag: string) {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    void isFlagEnabled(flag).then((value: boolean) => {
      if (isMounted) setEnabled(value);
    });

    return () => {
      isMounted = false;
    };
  }, [flag]);

  return enabled;
}
