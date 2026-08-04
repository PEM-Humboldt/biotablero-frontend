import { domToBlob, type Options } from "modern-screenshot";
import { uiText } from "@hooks/useReport/layout/uiText";

export async function makeMapImg(
  leafletElementId: string,
  screenshotOptions: Options,
): Promise<{
  map: string | null;
  errors: string[];
}> {
  const mapElement = document.getElementById(leafletElementId);
  if (!mapElement) {
    return {
      map: null,
      errors: ["Cannot get the map from the DOM"],
    };
  }

  try {
    const mapBlob = await domToBlob(mapElement, screenshotOptions);

    return {
      map: URL.createObjectURL(mapBlob),
      errors: [],
    };
  } catch (error) {
    console.error("Error while serializing map element:", error);
    return {
      map: null,
      errors: [uiText.context.utils.mapErrorSerialize],
    };
  }
}
