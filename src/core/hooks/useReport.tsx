import { toast } from "sonner";
import {
  ChartLine,
  FileCheck,
  FileXCorner,
  type LucideIcon,
  Shredder,
} from "lucide-react";
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
import workerUrl from "modern-screenshot/worker?url";
import { useLocation } from "react-router";
import { pdf } from "@react-pdf/renderer";

import { useUserCTX } from "@hooks/UserCTX";
import type {
  SearchSection,
  IndicatorContext,
  SearchContext,
  ReportMetadata,
  IndicatorSection,
  GraphDTO,
} from "@appTypes/report";
import { fetchInitiativeContext } from "@hooks/useReport/utils/fetchInitiativeContext";
import { makeMapImg } from "@hooks/useReport/utils/makeMapImg";
import { makeGraphImg } from "@hooks/useReport/utils/makeGraphImg";
import { CMIndicatorReportModel } from "@hooks/useReport/reportModels/CMIndicatorReportModel";
import { LOCALE } from "@config/monitoring";
import { ReportDocumentTree } from "@hooks/useReport/reportModels/ReportDocumentTree";

import type { InitiativeCompleteInfo } from "pages/monitoring/types/initiative";

type ReportContextType = {
  isLoading: boolean;
  errors: string[];
  reportContextResolver: (context: InitiativeCompleteInfo) => void;
  reportDownloaded: boolean;
  setCurrentSectionPool: (section: SectionInfo | null) => void;
  addSection: (userNote?: string) => Promise<void>;
  removeGraph: (sectionId: string, graphId: string) => void;
  removeSection: (sectionId: string) => void;
  removeReport: () => void;
  updateNote: (sectionId: string, graphId: string, newNote?: string) => void;
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
  sectionId: string;
  graphId: string;
  sectionInfo:
    | Omit<SearchSection, "graphs" | "mapUrl">
    | Omit<IndicatorSection, "graphs" | "mapUrl">;
  graphComponent: ReactElement;
  mapUrl: string | null;
  mapElementId: string | null;
};

export function ReportCTX({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [reportDownloaded, setReportDownloaded] = useState(true);

  const { user } = useUserCTX();
  // TODO: Complementar el type cuando se incorpore consultas
  const reportContextRef = useRef<InitiativeCompleteInfo | null>(null);

  const reportContextResolver = useCallback(
    (context: InitiativeCompleteInfo) => {
      reportContextRef.current = context;
    },
    [],
  );

  const currentSectionInfoPool = useRef<SectionInfo | null>(null);
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
    if (!user || !currentSectionInfoPool.current || !reportContextRef.current) {
      return;
    }

    setIsLoading(true);
    setErrors([]);

    if (!docContext) {
      const { data, errors: ctxErrors } =
        reportType === "InitiativeIndicator"
          ? await fetchInitiativeContext(reportContextRef.current)
          : { data: null, errors: [] };

      if (ctxErrors.length > 0) {
        setErrors(ctxErrors);
        return;
      }

      setDocContext(data);
    }

    const {
      sectionId,
      graphId,
      sectionInfo,
      graphComponent,
      mapElementId,
      mapUrl,
    } = currentSectionInfoPool.current;

    const currentSection = docSections.get(sectionId);

    let newMapUrl: string | null = mapUrl;
    if (!newMapUrl && mapElementId) {
      const buildtMap = await makeMapImg(mapElementId, {
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
      new Map(oldSections).set(sectionId, updatedSection),
    );

    toast("Agregado al reporte exitosamente", {
      position: "bottom-right",
      description: `${currentSectionInfoPool.current.sectionInfo.title} se ha agregado al reporte.`,
      icon: <FileCheck className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
      duration: 4 * 1000,
    });
  };

  const removeElements = useCallback(
    ({
      sectionId,
      graphId,
      toastInfo,
    }: {
      sectionId?: string;
      graphId?: string;
      toastInfo?: { title: string; description: string; icon: LucideIcon };
    }) => {
      setDocSections((oldSections) => {
        if (!sectionId) {
          for (const section of oldSections.values()) {
            section.graphs.forEach(revokeGraphUrls);
          }
          return new Map();
        }

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

        const graphToRemove = sectionToWork.graphs.find(
          (g) => g.id === graphId,
        );
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

      if (toastInfo) {
        toast(toastInfo.title, {
          position: "bottom-right",
          description: toastInfo.description,
          icon: <toastInfo.icon className="size-8 text-accent" />,
          className: "px-6! gap-6! border-2! border-accent!",
          duration: 4 * 1000,
        });
      }
    },
    [],
  );

  const removeSection = (sectionId: string) => {
    if (!docSections.has(sectionId)) {
      return;
    }
    removeElements({
      sectionId,
      toastInfo: {
        title: "Sección eliminada",
        description: `${sectionId} se ha eliminado del reporte.`,
        icon: FileXCorner,
      },
    });
  };

  const removeGraph = (sectionId: string, graphId: string) => {
    const sectionToWork = docSections.get(sectionId);
    if (!sectionToWork || !sectionToWork.graphs.some((g) => g.id === graphId)) {
      return;
    }

    if (sectionToWork.graphs.length <= 1) {
      removeSection(sectionId);
      return;
    }

    removeElements({
      sectionId,
      graphId,
      toastInfo: {
        title: "Grafica eliminada",
        description: `${graphId} se ha eliminado del reporte.`,
        icon: ChartLine,
      },
    });
  };

  const removeReport = () => {
    removeElements({
      toastInfo: {
        title: "Reporte descartado",
        description: "El reporte ha sido descartado correctamente",
        icon: Shredder,
      },
    });
  };

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

    const docMetadata: ReportMetadata = {
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
    };

    try {
      setIsLoading(true);
      if (reportType === "InitiativeIndicator" && docContext) {
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
    setReportDownloaded(false);
  }, [docSections]);

  useEffect(() => {
    return () => {
      removeElements({});
    };
  }, [removeElements]);

  const updateNote = (sectionId: string, graphId: string, newNote?: string) => {
    setDocSections((oldSections) => {
      const newSections = new Map(oldSections);
      const sectionToWork = newSections.get(sectionId);
      if (!sectionToWork) {
        return oldSections;
      }
      const graphIdx = sectionToWork.graphs.findIndex((g) => g.id === graphId);
      if (graphIdx < 0) {
        return oldSections;
      }

      const newGraphs = [...sectionToWork.graphs];
      newGraphs[graphIdx] = {
        ...newGraphs[graphIdx],
        userNote: newNote,
      };
      newSections.set(sectionId, { ...sectionToWork, graphs: newGraphs });
      return newSections;
    });
  };

  console.log(docSections);

  return (
    <ReportContext.Provider
      value={{
        isLoading,
        errors,
        reportContextResolver,
        reportDownloaded,
        setCurrentSectionPool,
        addSection,
        removeGraph,
        removeSection,
        removeReport,
        updateNote,
        toggleEditor,
        moveElement,
        openReportInNewTab,
        documentSections: docSections,
      }}
    >
      {isEditorOpen && (
        <div>
          <ReportDocumentTree documentSections={docSections} />
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
