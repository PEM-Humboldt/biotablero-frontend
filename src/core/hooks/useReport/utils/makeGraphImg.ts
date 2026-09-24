import type { ReactElement } from "react";
import { domToBlob, type Options } from "modern-screenshot";
import { createRoot } from "react-dom/client";
import { GRAPH_ANIMATION_CONFIG } from "@config/global";
import { uiText } from "@hooks/useReport/layout/uiText";
import { waitForAnimations } from "./waitForAnimations";

export async function makeGraphImg(
  graphComponent: ReactElement,
  screenshotOptions: Options,
): Promise<{
  graph: { blobUrl: string } | null;
  errors: string[];
}> {
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.width = "800px";
  document.body.appendChild(tempContainer);

  const root = createRoot(tempContainer);
  try {
    root.render(graphComponent);

    await waitForAnimations(tempContainer, {
      quietMs: 150,
      timeoutMs: GRAPH_ANIMATION_CONFIG.duration + 1000,
    });

    const graphBlob = await domToBlob(tempContainer, screenshotOptions);
    root.unmount();
    document.body.removeChild(tempContainer);

    return {
      graph: {
        blobUrl: URL.createObjectURL(graphBlob),
      },
      errors: [],
    };
  } catch (error) {
    console.error("Error while serializing graph element:", error);
    return {
      graph: null,
      errors: [uiText.context.utils.graphErrorSerialize],
    };
  }
}
