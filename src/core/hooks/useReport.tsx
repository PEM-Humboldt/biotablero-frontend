import {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserCTX } from "@hooks/UserContext";
import { domToBlob, type Options as ScrenshotOptions } from "modern-screenshot";
import workerUrl from "modern-screenshot/worker?url";
import { createRoot } from "react-dom/client";
import type {
  MapDTO,
  SectionDTO,
  SectionInfo,
} from "@hooks/useReport/types/useReport";
import { Report } from "@hooks/useReport/Report";
import { pdf } from "@react-pdf/renderer";

type ReportContextType = {
  isBusy: boolean;
  errors: string[];
  reportDownloaded: boolean;
  addSection: (
    sectionId: string,
    sectionInfo: SectionInfo,
    graphComponent: ReactElement,
    graphStateId: string | null,
    map: string | null,
  ) => Promise<void>;
  removeElement: (
    sectionId: string,
    graphStateId?: string,
    mapIndex?: number,
  ) => void;
  moveElement: (
    direction: "prev" | "next",
    sectionId: string,
    graphStateId?: string,
    mapIndex?: number,
  ) => void;
  openReportInNewTab: () => Promise<void>;
  documentSections: Map<string, SectionDTO>;
};

const ReportContext = createContext<ReportContextType | null>(null);

const screenshotOptions: ScrenshotOptions = {
  scale: 2,
  workerUrl,
  timeout: 10000,
};

export function ReportCTX({ children }: { children: ReactNode }) {
  const { user } = useUserCTX();
  const [isBusy, setIsBusy] = useState(false);
  const [reportDownloaded, setReportDownloaded] = useState(true);
  const [documentSections, setDocumentSections] = useState<
    Map<string, SectionDTO>
  >(new Map());
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setReportDownloaded(false);
  }, [documentSections]);

  const addSection = async (
    sectionId: string,
    sectionInfo: SectionInfo,
    graphComponent: ReactElement,
    graphStateId: string | null,
    map: string | null,
  ) => {
    if (!user) {
      return;
    }

    setIsBusy(true);
    setErrors([]);

    try {
      let mapDTO: MapDTO | null = null;

      if (map) {
        const mapElement = document.getElementById(map);
        if (!mapElement) {
          console.error("Cannot get the map from the DOM");
          setIsBusy(false);
          return;
        }

        const mapTitle =
          mapElement.getElementsByClassName("title")[0]?.textContent || "";
        const mapBlob = await domToBlob(mapElement, screenshotOptions);

        mapDTO = {
          title: mapTitle,
          blobUrl: URL.createObjectURL(mapBlob),
        };
      }

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "1200px";
      document.body.appendChild(tempContainer);

      const root = createRoot(tempContainer);
      root.render(graphComponent);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const graphBlob = await domToBlob(tempContainer, screenshotOptions);
      root.unmount();
      document.body.removeChild(tempContainer);

      const targetGraphState = graphStateId ?? "";
      const newGraphBlobUrl = URL.createObjectURL(graphBlob);

      setDocumentSections((oldSections) => {
        const newSections = new Map(oldSections);

        const existingSection = newSections.get(sectionId) ?? {
          title: sectionInfo.title,
          description: sectionInfo.description,
          link: window.location.href,
          graphs: [],
        };

        const graphIndex = existingSection.graphs.findIndex(
          (g) => g.state === targetGraphState,
        );

        const updatedGraphs = [...existingSection.graphs];

        if (graphIndex !== -1) {
          URL.revokeObjectURL(updatedGraphs[graphIndex].blobUrl);

          const existingMaps = updatedGraphs[graphIndex].maps;
          const updatedMaps = mapDTO ? [...existingMaps, mapDTO] : existingMaps;
          updatedGraphs[graphIndex] = {
            state: targetGraphState,
            blobUrl: newGraphBlobUrl,
            info: sectionInfo?.graphInfo,
            maps: updatedMaps,
          };
        } else {
          updatedGraphs.push({
            state: targetGraphState,
            blobUrl: newGraphBlobUrl,
            info: sectionInfo?.graphInfo,
            maps: mapDTO ? [mapDTO] : [],
          });
        }

        newSections.set(sectionId, {
          ...existingSection,
          graphs: updatedGraphs,
        });

        return newSections;
      });
    } catch (error) {
      console.error("Error while serializing DOM elements:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const removeElement = (
    sectionId: string,
    graphStateId?: string,
    mapIndex?: number,
  ) => {
    if (!documentSections.has(sectionId)) {
      return;
    }

    const isMapDel = graphStateId !== undefined && mapIndex !== undefined;
    const isGraphDel = graphStateId !== undefined && mapIndex === undefined;

    setDocumentSections((oldSections) => {
      const nextSections = new Map(oldSections);
      const section = nextSections.get(sectionId)!;

      if (isMapDel) {
        const graph = section.graphs.find((g) => g.state === graphStateId);
        if (!graph || graph.maps.length <= 1) {
          return oldSections;
        }

        const mapToRemove = graph.maps[mapIndex];
        if (!mapToRemove) {
          return oldSections;
        }

        URL.revokeObjectURL(mapToRemove.blobUrl);
        nextSections.set(sectionId, {
          ...section,
          graphs: section.graphs.map((g) =>
            g.state === graphStateId
              ? { ...g, maps: g.maps.filter((_, index) => index !== mapIndex) }
              : g,
          ),
        });

        return nextSections;
      }

      if (isGraphDel) {
        if (section.graphs.length <= 1) {
          return oldSections;
        }
        const graph = section.graphs.find((g) => g.state === graphStateId);
        if (!graph) {
          return oldSections;
        }

        URL.revokeObjectURL(graph.blobUrl);
        graph.maps.forEach((m) => URL.revokeObjectURL(m.blobUrl));

        nextSections.set(sectionId, {
          ...section,
          graphs: section.graphs.filter((g) => g.state !== graphStateId),
        });

        return nextSections;
      }

      section.graphs.forEach((g) => {
        URL.revokeObjectURL(g.blobUrl);
        g.maps.forEach((m) => URL.revokeObjectURL(m.blobUrl));
      });

      nextSections.delete(sectionId);
      return nextSections;
    });
  };

  const moveElement = (
    direction: "prev" | "next",
    sectionId: string,
    graphStateId?: string,
    mapIndex?: number,
  ) => {
    const section = documentSections.get(sectionId);
    if (!section) {
      return;
    }

    const isMapMove = graphStateId !== undefined && mapIndex !== undefined;
    const isGraphMove = graphStateId !== undefined && mapIndex === undefined;

    if (isMapMove) {
      const graph = section.graphs.find((g) => g.state === graphStateId);
      if (
        !graph ||
        (direction === "prev" && mapIndex === 0) ||
        (direction === "next" && mapIndex === graph.maps.length - 1)
      ) {
        return;
      }
    }

    if (isGraphMove) {
      const graphIndex = section.graphs.findIndex(
        (g) => g.state === graphStateId,
      );
      if (
        graphIndex === -1 ||
        (direction === "prev" && graphIndex === 0) ||
        (direction === "next" && graphIndex === section.graphs.length - 1)
      ) {
        return;
      }
    }

    if (graphStateId === undefined) {
      const keys = Array.from(documentSections.keys());
      const sectionIndex = keys.indexOf(sectionId);
      if (
        sectionIndex === -1 ||
        (direction === "prev" && sectionIndex === 0) ||
        (direction === "next" && sectionIndex === keys.length - 1)
      ) {
        return;
      }
    }

    function reorderArray<T>(
      arr: T[],
      index: number,
      dir: "prev" | "next",
    ): T[] {
      const targetIndex = dir === "prev" ? index - 1 : index + 1;
      const result = [...arr];
      const [movedItem] = result.splice(index, 1);
      result.splice(targetIndex, 0, movedItem);
      return result;
    }

    setDocumentSections((oldSections) => {
      const nextSections = new Map(oldSections);
      const currentSection = oldSections.get(sectionId)!;

      if (isMapMove) {
        nextSections.set(sectionId, {
          ...currentSection,
          graphs: currentSection.graphs.map((g) =>
            g.state === graphStateId
              ? { ...g, maps: reorderArray(g.maps, mapIndex, direction) }
              : g,
          ),
        });
        return nextSections;
      }

      if (isGraphMove) {
        const graphIndex = currentSection.graphs.findIndex(
          (g) => g.state === graphStateId,
        );
        nextSections.set(sectionId, {
          ...currentSection,
          graphs: reorderArray(currentSection.graphs, graphIndex, direction),
        });
        return nextSections;
      }

      const keys = Array.from(oldSections.keys());
      const sectionIndex = keys.indexOf(sectionId);
      const reorderedKeys = reorderArray(keys, sectionIndex, direction);

      const orderedSections = new Map<string, SectionDTO>();
      reorderedKeys.forEach((key) => {
        orderedSections.set(key, oldSections.get(key)!);
      });

      return orderedSections;
    });
  };

  const openReportInNewTab = async () => {
    if (!user) {
      return;
    }
    try {
      const sections = Array.from(documentSections.values());
      const blob = await pdf(
        <Report
          sections={sections}
          creator={{ name: user.name ?? user.email, email: user.email }}
        />,
      ).toBlob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        isBusy,
        errors,
        reportDownloaded,
        addSection,
        removeElement,
        moveElement,
        openReportInNewTab,
        documentSections,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);

  if (!context) {
    throw new Error("useReportCTX mus be within the ReportCTX");
  }

  return context;
}
