import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { useUserCTX } from "@hooks/UserContext";
import { domToBlob, type Options as ScrenshotOptions } from "modern-screenshot";
import workerUrl from "modern-screenshot/worker?url";

type MapDTO = { title: string; blobUrl: string };
type GraphDTO = { state: string; blobUrl: string; maps: MapDTO[] };
type SectionDTO = {
  title: string;
  description: string;
  link: string;
  graphs: GraphDTO[];
};

type SectionInfo = {
  title: string;
  description: string;
  includeMap: boolean;
  aditionalInfo?: Record<string, string>;
};

type ReportContextType = {
  addSection: (
    sectionInfo: SectionInfo,
    graphDOMId: string,
    graphStateId: string | null,
    map: { mapDOMId: string } | null,
  ) => Promise<void>;
  documentSections: SectionDTO[];
  removeSection: (sectionTitle: string) => void;
  removeGraphFromSection: (sectionTitle: string, graphStateId: string) => void;
  removeMapFromSection: (
    sectionTitle: string,
    graphStateId: string | null,
    mapIndex: number,
  ) => void;
  isBusy: boolean;
  errors: string[];
};

const ReportContext = createContext<ReportContextType | null>(null);

export function ReportCTX({ children }: { children: ReactNode }) {
  const { user } = useUserCTX();
  const [isBusy, setIsBusy] = useState(false);
  const [documentSections, setDocumentSections] = useState<SectionDTO[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const documentMeta = useRef(
    user ? { creator: user?.name, creatorEmail: user.email } : null,
  );

  const addSection = async (
    sectionInfo: SectionInfo,
    graphDOMId: string,
    graphStateId: string | null,
    map: { mapDOMId: string } | null,
  ) => {
    if (!user) {
      return;
    }

    setIsBusy(true);
    setErrors([]);

    try {
      const sectionInfoObject: SectionDTO = {
        title: sectionInfo.title,
        description: sectionInfo.description,
        link: window.location.href,
        graphs: [],
        ...sectionInfo.aditionalInfo,
      };

      const graphElement = document.getElementById(graphDOMId);
      let mapDTO: MapDTO | null = null;
      let mapElement: HTMLElement | null = null;
      let mapTitle = null;

      const screenshotOptions: ScrenshotOptions = {
        scale: 2,
        workerUrl,
        timeout: 10000,
      };

      if (map) {
        mapElement = document.getElementById(map.mapDOMId);

        if (!mapElement) {
          console.error("Cannot get the map from the DOM");
          return;
        }

        mapTitle =
          mapElement.getElementsByClassName("title")[0]?.textContent || "";

        const mapBlob = await domToBlob(mapElement, screenshotOptions);

        mapDTO = {
          title: mapTitle,
          blobUrl: URL.createObjectURL(mapBlob),
        };
      }

      if (!graphElement) {
        console.error("Cannot find the graph in the DOM");
        return;
      }

      const graphBlob = await domToBlob(graphElement, screenshotOptions);

      const graphDTO: GraphDTO = {
        state: "",
        blobUrl: URL.createObjectURL(graphBlob),
        maps: mapDTO ? [mapDTO] : [],
      };

      sectionInfoObject.graphs.push(graphDTO);

      const preview = window.open();
      if (preview) {
        if (mapDTO) {
          const mapImg = preview.document.createElement("img");
          mapImg.src = mapDTO.blobUrl;
          mapImg.alt = "Preview mapa";
          preview.document.body.appendChild(mapImg);
        }

        const graphImg = preview.document.createElement("img");
        graphImg.src = graphDTO.blobUrl;
        graphImg.alt = "Preview gráfica";
        preview.document.body.appendChild(graphImg);
      }

      setDocumentSections((oldSections) => [...oldSections, sectionInfoObject]);
    } catch (error) {
      console.error("Error while serializing DOM elements:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const removeSection = (sectionTitle: string) => {
    const selectedSection = documentSections.find(
      (s) => s.title === sectionTitle,
    );
    if (!selectedSection) {
      return;
    }

    selectedSection.graphs.forEach((graph) => {
      URL.revokeObjectURL(graph.blobUrl);

      graph.maps.forEach((map) => {
        URL.revokeObjectURL(map.blobUrl);
      });
    });

    setDocumentSections((oldSections) =>
      oldSections.filter((s) => s.title !== sectionTitle),
    );
  };

  const removeGraphFromSection = (
    sectionTitle: string,
    graphStateId: string,
  ) => {
    const sectionIdx = documentSections.findIndex(
      (s) => s.title === sectionTitle,
    );
    if (sectionIdx === -1) {
      return;
    }

    const section = documentSections[sectionIdx];
    if (section.graphs.length <= 1) {
      return;
    }

    const graphIdx = section.graphs.findIndex((g) => g.state === graphStateId);
    if (graphIdx === -1) {
      return;
    }

    const graphToRemove = section.graphs[graphIdx];
    if (graphToRemove.blobUrl && graphToRemove.blobUrl.startsWith("blob:")) {
      URL.revokeObjectURL(graphToRemove.blobUrl);
    }
    graphToRemove.maps.forEach((m) => {
      if (m.blobUrl && m.blobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(m.blobUrl);
      }
    });

    setDocumentSections((oldSections) => {
      const newSections = [...oldSections];

      newSections[sectionIdx] = {
        ...newSections[sectionIdx],
        graphs: newSections[sectionIdx].graphs.filter(
          (g) => g.state !== graphStateId,
        ),
      };

      return newSections;
    });
  };

  const removeMapFromSection = (
    sectionTitle: string,
    graphStateId: string | null,
    mapIndex: number,
  ) => {
    const sectionIdx = documentSections.findIndex(
      (s) => s.title === sectionTitle,
    );
    if (sectionIdx === -1) {
      return;
    }
    const section = documentSections[sectionIdx];
    const graphIdx = graphStateId
      ? section.graphs.findIndex((g) => g.state === graphStateId)
      : 0;

    if (
      section.graphs[graphIdx].maps.length === 1 ||
      graphIdx === -1 ||
      !section.graphs[graphIdx]
    ) {
      return;
    }

    const graph = section.graphs[graphIdx];
    const mapToRemove = graph.maps[mapIndex];
    if (!mapToRemove) {
      return;
    }

    if (mapToRemove.blobUrl && mapToRemove.blobUrl.startsWith("blob:")) {
      URL.revokeObjectURL(mapToRemove.blobUrl);
    }

    setDocumentSections((oldSections) => {
      const newSections = [...oldSections];
      const newGraphs = [...newSections[sectionIdx].graphs];
      const newMaps = [...newGraphs[graphIdx].maps];
      newMaps.splice(mapIndex, 1);
      newGraphs[graphIdx] = {
        ...newGraphs[graphIdx],
        maps: newMaps,
      };
      newSections[sectionIdx] = {
        ...newSections[sectionIdx],
        graphs: newGraphs,
      };

      return newSections;
    });
  };

  return (
    <ReportContext.Provider
      value={{
        addSection,
        documentSections,
        isBusy,
        errors,
        removeSection,
        removeGraphFromSection,
        removeMapFromSection,
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
