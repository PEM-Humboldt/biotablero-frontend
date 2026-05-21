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

type MapDTO = { state: string; blobUrl: string; bound: LatLngBoundsLiteral };
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
    seciontInfo: SectionInfo<T>,
    graphDOMId: string,
    mapDOMId: string | null,
  ) => Promise<void | SerializeError>;
  documentSections: SectionDTO[];
  // getPreview:
  // download:
};

const ReportContext = createContext<ReportContextType | null>(null);

export function ReportCTX({ children }: { children: ReactNode }) {
  const { user } = useUserCTX();
  const [documentSections, setDocumentSections] = useState<SectionDTO[]>([]);
  const documentMeta = useRef(
    user ? { creator: user?.name, creatorEmail: user.email } : null,
  );

  const addSection = async <T extends Record<string, string>>(
    sectionInfo: SectionInfo<T>,
    graphDOMId: string,
    mapDOMId: string | null,
  ) => {
    if (!user) {
      return;
    }

    const sectionInfoObject: SectionDTO = {
      title: sectionInfo.title,
      description: sectionInfo.description,
      link: window.location.href,
      graphs: [],
      ...sectionInfo.aditionalInfo,
    };

    const graphElement = document.getElementById(graphDOMId);
    const mapElement =
      sectionInfo.includeMap && mapDOMId
        ? document.getElementById(mapDOMId)
        : null;

    if (!graphElement || (sectionInfo.includeMap && !mapElement)) {
      return {
        type: "The graph or the map are not in the DOM",
        action: "No fue posible obtener la gráfica o el mapa.",
      } as SerializeError;
    }

    const graphBLOBUrl = await domToPng(graphElement);

    setDocumentSections((oldSections) => [...oldSections, sectionInfoObject]);
  };

  return (
    <ReportContext.Provider value={{ addSection, documentSections }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReportCTX() {
  const context = useContext(ReportContext);

  if (!context) {
    throw new Error("useReportCTX mus be within the ReportCTX");
  }

  return context;
}
