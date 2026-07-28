import {
  createContext,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUserCTX } from "@hooks/UserCTX";
import workerUrl from "modern-screenshot/worker?url";
import type {
  SectionDTO,
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

type ReportContextType = {
  isBusy: boolean;
  errors: string[];
  reportDownloaded: boolean;
  addSection: (
    baseId: string,
    graphStateStringId: string,
    sectionInfo:
      | Omit<SearchSection, "graphs" | "mapUrl">
      | Omit<IndicatorSection, "graphs" | "mapUrl">,
    graphComponent: ReactElement,
    mapFromLeafletElementId: string | null,
    userNote?: string,
  ) => Promise<void>;
  removeElement: (sectionId: string, graphStateId?: string) => void;
  removeReport: () => void;
  moveElement: (
    direction: "prev" | "next",
    sectionId: string,
    graphStateId?: string,
  ) => void;
  openReportInNewTab: () => Promise<void>;
  documentSections: Map<string, SectionDTO>;
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

export function ReportCTX({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [reportDownloaded, setReportDownloaded] = useState(true);

  const { user } = useUserCTX();
  const { initiativeInfo } = useInitiativeCTX();

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
      return "Monitoring";
    }

    const fullPath = mcIndicatorPathComponents.every((required) =>
      segments.includes(required),
    );

    return fullPath ? "InitiativeIndicator" : null;
  }, [pathname]);

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

  const addSection = async (
    baseId: string,
    graphStateStringId: string,
    sectionInfo:
      | Omit<SearchSection, "graphs" | "mapUrl">
      | Omit<IndicatorSection, "graphs" | "mapUrl">,
    graphComponent: ReactElement,
    mapFromLeafletElementId: string | null,
    userNote?: string,
  ) => {
    if (!user) {
      return;
    }

    const currentSection = docSections.get(baseId);
    if (
      currentSection &&
      currentSection.graphs.some((g) => g.id === graphStateStringId)
    ) {
      return;
    }

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
      id: graphStateStringId,
      blobUrl: buildtGraph.graph.blobUrl,
      userNote: userNote,
      mapUrl: newMapUrl ?? undefined,
    };

    const updatedSection: SearchSection | IndicatorSection = {
      ...(currentSection ?? {}),
      ...sectionInfo,
      graphs: [...(currentSection?.graphs ?? []), newGraph],
    };

    setDocSections((oldSections) =>
      new Map(oldSections).set(baseId, updatedSection),
    );
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

  const removeReport = useCallback(() => {
    for (const section of docSections.keys()) {
      removeElement(section);
    }
  }, [docSections, removeElement]);

  const openReportInNewTab = async () => {
    if (!user) {
      return;
    }
    try {
      setIsLoading(true);
      const sections = Array.from(docSections.values());
      const blob = await pdf(
        <CMIndicatorReportModel
          sections={sections}
          creator={{ name: user.name ?? user.email, email: user.email }}
        />,
      ).toBlob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setReportDownloaded(false);
  }, [docSections]);

  useEffect(() => {
    return () => {
      removeReport();
    };
  }, [removeReport]);

  console.log("meta", docMetadata, "cotx", docContext);

  return (
    <ReportContext.Provider
      value={{
        isBusy: isLoading,
        errors,
        reportDownloaded,
        addSection,
        removeElement,
        removeReport,
        moveElement,
        openReportInNewTab,
        documentSections: docSections,
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
