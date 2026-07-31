import type { ReactElement } from "react";
import { domToBlob, type Options } from "modern-screenshot";
import { createRoot } from "react-dom/client";
import { GRAPH_ANIMATION_CONFIG } from "@config/monitoring";

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
  tempContainer.style.width = "1200px";
  document.body.appendChild(tempContainer);

  const root = createRoot(tempContainer);
  try {
    root.render(graphComponent);

    await new Promise((resolve) =>
      setTimeout(resolve, GRAPH_ANIMATION_CONFIG.duration + 200),
    );

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
    console.error("Error while serializing DOM elements:", error);
    return {
      graph: null,
      errors: ["No es posible crear el pdf del gráfico"],
    };
  }
}
