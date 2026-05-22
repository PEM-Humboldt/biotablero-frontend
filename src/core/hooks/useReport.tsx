import { type LatLngBoundsLiteral } from "leaflet";
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { useUserCTX } from "@hooks/UserContext";
import { domToPng } from "modern-screenshot";

type MapDTO = { title: string; blobUrl: string };
type GraphDTO = { state: string; blobUrl: string; maps: MapDTO[] };
type SectionDTO = {
  title: string;
  description: string;
  link: string;
  graphs: GraphDTO[];
};

type SectionInfo<T extends Record<string, string>> = {
  title: string;
  description: string;
  includeMap: boolean;
  aditionalInfo?: T;
};

type SerializeError = { type: string; action: string };

type ReportContextType = {
  addSection: <T extends Record<string, string>>(
    sectionInfo: SectionInfo<T>,
    graphDOMId: string,
    map: { mapDOMId: string } | null,
  ) => Promise<void | string>;
  documentSections: SectionDTO[];
  isBusy: boolean;
  // getPreview:
  // download:
};

const ReportContext = createContext<ReportContextType | null>(null);

export function ReportCTX({ children }: { children: ReactNode }) {
  const { user } = useUserCTX();
  const [isBusy, setIsBusy] = useState(false);
  const [documentSections, setDocumentSections] = useState<SectionDTO[]>([]);
  const documentMeta = useRef(
    user ? { creator: user?.name, creatorEmail: user.email } : null,
  );

  const addSection = async <T extends Record<string, string>>(
    sectionInfo: SectionInfo<T>,
    graphDOMId: string,
    map: { mapDOMId: string } | null,
  ) => {
    if (!user) {
      return "Debes ser un usuario registrado para crear reportes";
    }

    setIsBusy(true);

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

    if (map) {
      mapElement = document.getElementById(map.mapDOMId);

      if (!mapElement) {
        setIsBusy(false);
        console.error("Cannot get the map from the DOM");
        return "No fue posible obtener el mapa.";
      }

      mapTitle = mapElement
        ? mapElement.getElementsByClassName("title")[0].textContent
        : "";

      mapDTO = {
        title: mapTitle,
        blobUrl: await domToPng(mapElement),
      };
    }

    if (!graphElement) {
      setIsBusy(false);
      console.error("Cannot find the graph in the DOM");
      return "No fue posible obtener la gráfica.";
    }

    const graphBLOBUrl = await domToPng(graphElement);

    const graphDTO: GraphDTO = {
      state: "",
      blobUrl: graphBLOBUrl,
      maps: mapDTO ? [mapDTO] : [],
    };

    sectionInfoObject.graphs.push(graphDTO);

    const preview = window.open();

    if (preview) {
      if (mapDTO) {
        const map = preview.document.createElement("img");
        map.src = mapDTO.blobUrl;
        map.alt = "Preview";
        map.style.maxWidth = "100%";
        preview.document.body.appendChild(map);
      }

      const graph = preview.document.createElement("img");
      graph.src = graphDTO.blobUrl;
      graph.alt = "Preview";
      graph.style.maxWidth = "100%";
      preview.document.body.appendChild(graph);
    }

    setIsBusy(false);
    setDocumentSections((oldSections) => [...oldSections, sectionInfoObject]);
  };

  return (
    <ReportContext.Provider value={{ addSection, documentSections, isBusy }}>
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
