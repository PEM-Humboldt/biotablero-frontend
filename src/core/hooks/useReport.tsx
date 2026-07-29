import {
  createContext,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUserCTX } from "@hooks/UserCTX";
import workerUrl from "modern-screenshot/worker?url";
import type {
  SearchSection,
  IndicatorContext,
  SearchContext,
  ReportMetadata,
  IndicatorSection,
  GraphDTO,
} from "@appTypes/report";
import { CMIndicatorReportModel } from "@hooks/useReport/reportModels/CMIndicatorReportModel";
import { pdf } from "@react-pdf/renderer";
import { useLocation } from "react-router";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { fetchIndicatorContext } from "@hooks/useReport/utils/fetchInitiativeContext";
import { LOCALE } from "@config/monitoring";
import { makeMapImg } from "@hooks/useReport/utils/makeMapImg";
import { makeGraphImg } from "@hooks/useReport/utils/makeGraphImg";
import { toast } from "sonner";
import { FileCheck, Shredder } from "lucide-react";

type ReportContextType = {
  isLoading: boolean;
  errors: string[];
  reportDownloaded: boolean;
  setCurrentSectionPool: (section: SectionInfo | null) => void;
  addSection: (userNote?: string) => Promise<void>;
  removeElement: (sectionId: string, graphStateId?: string) => void;
  removeCurrentSection: () => void;
  removeReport: () => void;
  toggleEditor: (forceState?: boolean) => void;
  moveElement: (
    direction: "prev" | "next",
    sectionId: string,
    graphStateId?: string,
  ) => void;
  openReportInNewTab: () => Promise<void>;
  documentSections: Map<string, SearchSection | IndicatorSection>;
};

const ReportContext = createContext<ReportContextType | null>(null);

const mcIndicatorPathComponents = ["Monitoreo", "Iniciativas", "Indicadores"];
const searchComponents = ["Consultas"];

const revokeGraphUrls = (graph: GraphDTO) => {
  URL.revokeObjectURL(graph.blobUrl);
  if (graph.mapUrl) {
    URL.revokeObjectURL(graph.mapUrl);
  }
};

type SectionInfo = {
  baseId: string;
  graphStateStringId: string;
  sectionInfo:
    | Omit<SearchSection, "graphs" | "mapUrl">
    | Omit<IndicatorSection, "graphs" | "mapUrl">;
  graphComponent: ReactElement;
  mapFromLeafletElementId: string | null;
};

export function ReportCTX({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [reportDownloaded, setReportDownloaded] = useState(true);

  const { user } = useUserCTX();
  const { initiativeInfo } = useInitiativeCTX();

  const currentSectionInfoPool = useRef<SectionInfo | null>(null);
  const [docMetadata, setDocMetadata] = useState<ReportMetadata | null>(null);
  const [docContext, setDocContext] = useState<
    IndicatorContext | SearchContext | null
  >(null);
  const [docSections, setDocSections] = useState<
    Map<string, SearchSection | IndicatorSection>
  >(new Map());

  const reportType = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment === searchComponents[0]) {
      return "Search";
    }

    const fullPath = mcIndicatorPathComponents.every((required) =>
      segments.includes(required),
    );

    return fullPath ? "InitiativeIndicator" : null;
  }, [pathname]);

  const addSection = async (userNote?: string) => {
    if (!user || !currentSectionInfoPool.current) {
      return;
    }

    const {
      baseId,
      graphStateStringId: graphId,
      sectionInfo,
      graphComponent,
      mapFromLeafletElementId,
    } = currentSectionInfoPool.current;

    const currentSection = docSections.get(baseId);

    setIsLoading(true);
    setErrors([]);

    let newMapUrl: string | null = null;
    if (mapFromLeafletElementId) {
      const buildtMap = await makeMapImg(mapFromLeafletElementId, {
        scale: 2,
        workerUrl,
        timeout: 10000,
      });

      if (buildtMap.errors.length > 0 || !buildtMap.map) {
        setErrors(buildtMap.errors);
        setIsLoading(false);
        return;
      }
      newMapUrl = buildtMap.map;
    }

    const buildtGraph = await makeGraphImg(graphComponent, {
      scale: 2,
      workerUrl,
      timeout: 10000,
    });
    setIsLoading(false);
    if (buildtGraph.errors.length > 0 || !buildtGraph.graph) {
      setErrors(buildtGraph.errors);
      return;
    }

    const newGraph: GraphDTO = {
      id: graphId,
      blobUrl: buildtGraph.graph.blobUrl,
      userNote: userNote,
      mapUrl: newMapUrl ?? undefined,
    };

    const updatedSection: SearchSection | IndicatorSection = {
      ...(currentSection ?? {}),
      ...sectionInfo,
      graphs: [
        ...(currentSection?.graphs.filter((g) => g.id !== graphId) ?? []),
        newGraph,
      ],
    };

    setDocSections((oldSections) =>
      new Map(oldSections).set(baseId, updatedSection),
    );

    toast("Agregado al reporte exitosamente", {
      position: "bottom-right",
      description: `${currentSectionInfoPool.current.sectionInfo.title} se ha agregado al reporte.`,
      icon: <FileCheck className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
      duration: 4 * 1000,
    });
  };

  const removeElement = useCallback((sectionId: string, graphId?: string) => {
    setDocSections((oldSections) => {
      const updatedSections = new Map(oldSections);
      const sectionToWork = updatedSections.get(sectionId);
      if (!sectionToWork) {
        return oldSections;
      }

      if (!graphId) {
        sectionToWork.graphs.forEach(revokeGraphUrls);
        updatedSections.delete(sectionId);
        return updatedSections;
      }

      const graphToRemove = sectionToWork.graphs.find((g) => g.id === graphId);
      if (!graphToRemove) {
        return oldSections;
      }

      revokeGraphUrls(graphToRemove);
      updatedSections.set(sectionId, {
        ...sectionToWork,
        graphs: sectionToWork.graphs.filter((g) => g.id !== graphId),
      });

      return updatedSections;
    });
  }, []);

  const removeCurrentSection = () => {
    if (
      !currentSectionInfoPool.current?.baseId ||
      !docSections.get(currentSectionInfoPool.current?.baseId)
    ) {
      return;
    }
    removeElement(currentSectionInfoPool.current.baseId);

    toast("Sección eliminada", {
      position: "bottom-right",
      description: `${currentSectionInfoPool.current.sectionInfo.title} se ha eliminado del reporte.`,
      icon: <Shredder className="size-8 text-accent" />,
      className: "px-6! gap-6! border-2! border-accent!",
      duration: 4 * 1000,
    });
  };

  const removeReport = useCallback(() => {
    setDocSections((oldSections) => {
      const sections = [...oldSections.keys()];
      for (const section of sections) {
        removeElement(section);
      }
      return new Map();
    });

    toast("Reporte descartado", {
      position: "bottom-right",
      description: "El reporte ha sido descartado correctamente",
      icon: <Shredder className="size-8 text-accent" />,
      className: "px-6! gap-6! border-2! border-accent!",
      duration: 4 * 1000,
    });
  }, [removeElement]);

  const moveElement = (
    direction: "prev" | "next",
    sectionId: string,
    graphStateId?: string,
  ) => {
    const shift = direction === "prev" ? -1 : 1;

    setDocSections((oldSections) => {
      if (graphStateId) {
        const section = oldSections.get(sectionId);
        if (!section) {
          return oldSections;
        }

        const graphIdx = section.graphs.findIndex((g) => g.id === graphStateId);
        const newIdx = graphIdx + shift;

        if (graphIdx < 0 || newIdx < 0 || newIdx >= section.graphs.length) {
          return oldSections;
        }

        const newGraphs = [...section.graphs];
        [newGraphs[graphIdx], newGraphs[newIdx]] = [
          newGraphs[newIdx],
          newGraphs[graphIdx],
        ];

        return new Map(oldSections).set(sectionId, {
          ...section,
          graphs: newGraphs,
        });
      }

      const sectionKeys = [...oldSections.keys()];
      const sectionIdx = sectionKeys.findIndex((id) => id === sectionId);
      const newIdx = sectionIdx + shift;

      if (sectionIdx < 0 || newIdx < 0 || newIdx >= sectionKeys.length) {
        return oldSections;
      }

      [sectionKeys[sectionIdx], sectionKeys[newIdx]] = [
        sectionKeys[newIdx],
        sectionKeys[sectionIdx],
      ];

      const newSections = new Map();
      sectionKeys.forEach((key) => {
        newSections.set(key, oldSections.get(key));
      });

      return newSections;
    });
  };

  const openReportInNewTab = async () => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);
      if (reportType === "InitiativeIndicator" && docMetadata && docContext) {
        const blob = await pdf(
          <CMIndicatorReportModel
            metadata={docMetadata}
            context={docContext as IndicatorContext}
            sections={docSections as Map<string, IndicatorSection>}
          />,
        ).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      }
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentSectionPool = (section: SectionInfo | null) => {
    currentSectionInfoPool.current = section;
  };

  const toggleEditor = (forceState?: boolean) => {
    setIsEditorOpen((oldState) =>
      forceState !== undefined ? forceState : !oldState,
    );
  };

  useEffect(() => {
    if (!user) {
      setDocMetadata(null);
      return;
    }

    setDocMetadata({
      creationDate: new Date().toLocaleDateString(LOCALE, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      madeBy: {
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
      },
    });
  }, [user]);

  useEffect(() => {
    const fetchContext = async () => {
      if (reportType === "InitiativeIndicator" && initiativeInfo) {
        setIsLoading(true);
        setErrors([]);
        setDocContext(null);

        const { data, errors: fetchErrors } =
          await fetchIndicatorContext(initiativeInfo);
        setIsLoading(false);
        if (fetchErrors.length > 0 || !data) {
          setErrors(fetchErrors);
          return;
        }

        setDocContext(data);
      }
    };

    void fetchContext();
  }, [initiativeInfo, reportType]);

  useEffect(() => {
    setReportDownloaded(false);
  }, [docSections]);

  useEffect(() => {
    return () => {
      removeReport();
    };
  }, [removeReport]);

  // TODO: update note

  console.log(docSections);

  return (
    <ReportContext.Provider
      value={{
        isLoading,
        errors,
        reportDownloaded,
        setCurrentSectionPool,
        addSection,
        removeElement,
        removeCurrentSection,
        removeReport,
        toggleEditor,
        moveElement,
        openReportInNewTab,
        documentSections: docSections,
      }}
    >
      {isEditorOpen && (
        <div>
          {[...docSections.keys()].join(", ")}
          <button onClick={() => toggleEditor(false)}>cerrar editor</button>
        </div>
      )}
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
