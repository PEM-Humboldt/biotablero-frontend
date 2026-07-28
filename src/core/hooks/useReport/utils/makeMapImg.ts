import { domToBlob, type Options } from "modern-screenshot";

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
    console.error("Error while serializing DOM elements:", error);
    return {
      map: null,
      errors: ["No es posible crear el pdf del mapa"],
    };
  }
}
