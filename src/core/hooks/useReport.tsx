import {
  type ComponentType,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChartLine,
  CircleSlash,
  FileCheck,
  FileDown,
  FileXCorner,
  FileXIcon,
  Shredder,
  type LucideIcon,
} from "lucide-react";
import workerUrl from "modern-screenshot/worker?url";
import { toast } from "sonner";
import { useBlocker, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import TextareaAutosize from "react-textarea-autosize";
import { pdf } from "@react-pdf/renderer";

import {
  REPORT_DOWNLOAD_NAME_PREFIX,
  REPORT_NOTE_MAX_LENGTH,
} from "@config/report";
import { inputWarnColor } from "@utils/ui";
import { useUserCTX } from "@hooks/UserCTX";
import { fetchContext } from "@hooks/useReport/utils/fetchModuleContext";
import { makeMapImg } from "@hooks/useReport/utils/makeMapImg";
import { makeGraphImg } from "@hooks/useReport/utils/makeGraphImg";
import { CMIndicatorReportModel } from "@hooks/useReport/reportModels/CMIndicatorReportModel";
import { SearchIndicatorReportModel } from "@hooks/useReport/reportModels/SearchIndicatorReportModel";
import { LOCALE } from "@config/global";
import { ReportDocumentTree } from "@hooks/useReport/reportModels/ReportDocumentTree";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import {
  ReportType,
  type GraphDTO,
  type IndicatorContext,
  type IndicatorSection,
  type ReportContextType,
  type ReportMetadata,
  type ReportModelProps,
  type SearchContext,
  type SearchSection,
  type SectionInfo,
} from "@appTypes/report";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@ui/shadCN/component/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/shadCN/component/alert-dialog";
import { uiText } from "@hooks/useReport/layout/uiText";
import { StrValidator } from "@utils/strValidator";
import { InputGroup, InputGroupAddon } from "@ui/shadCN/component/input-group";

// TODO: revisar estas importaciones de tipos desde pages
import type { InitiativeCompleteInfo } from "pages/monitoring/types/initiative";
import type { SearchState } from "pages/search/hooks/SearchReducer";

// TODO: crear el back de Consultas para poder manejar sus propias métricas, de momento está enlazado a Monitoreo
import { sendReportDownloadReason } from "pages/monitoring/api/services/report";

const mcIndicatorPathComponents = ["Monitoreo", "Iniciativas", "Indicadores"];
const searchComponents = ["Consultas"];

const revokeGraphUrls = (graph: GraphDTO) => {
  URL.revokeObjectURL(graph.blobUrl);

  if (graph.mapUrl) {
    URL.revokeObjectURL(graph.mapUrl);
  }
};

const documentModels: Partial<
  Record<ReportType, ComponentType<ReportModelProps>>
> = {
  [ReportType.MONITORING_INDICATORS]:
    CMIndicatorReportModel as ComponentType<ReportModelProps>,
  [ReportType.SEARCH_INDICATORS]:
    SearchIndicatorReportModel as ComponentType<ReportModelProps>,
};

const ReportContext = createContext<ReportContextType | null>(null);

export function ReportCTX({ children }: { children: ReactNode }) {
  // Contextos
  const { pathname } = useLocation();
  const { user } = useUserCTX();

  // Referencias
  const currentSectionInfoPool = useRef<SectionInfo | null>(null);
  const sectionsRegistryRef = useRef<Map<string, SectionInfo>>(new Map());
  const leaveCallbackRef = useRef<(() => void) | null>(null);
  const reportContextRef = useRef<InitiativeCompleteInfo | SearchState | null>(
    null,
  );

  // Estados locales
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [reportDownloaded, setReportDownloaded] = useState(true);

  // Estados de integración
  const [whyDownload, setWhyDownload] = useState("");
  const [docContext, setDocContext] = useState<
    IndicatorContext | SearchContext | null
  >(null);
  const [docSections, setDocSections] = useState<
    Map<string, SearchSection | IndicatorSection>
  >(new Map());

  // Funcionalidad

  const reportType = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment === searchComponents[0]) {
      return ReportType.SEARCH_INDICATORS;
    }

    const fullPath = mcIndicatorPathComponents.every((required) =>
      segments.includes(required),
    );

    return fullPath ? ReportType.MONITORING_INDICATORS : ReportType.NONE;
  }, [pathname]);

  const reportContextResolver = useCallback(
    (context: InitiativeCompleteInfo | SearchState) => {
      reportContextRef.current = context;
    },
    [],
  );

  const addSection = useCallback(
    async (userNote?: string, selectedSection?: SectionInfo) => {
      const sectionToAddInfo =
        selectedSection || currentSectionInfoPool.current;
      if (!user || !sectionToAddInfo) {
        return;
      }

      setIsLoading(true);
      setErrors([]);

      if (!docContext) {
        const { data, errors: ctxErrors } = await fetchContext(
          reportType,
          reportContextRef.current,
        );

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
        sectionUrl,
      } = sectionToAddInfo;

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
        userNote: userNote ? StrValidator.sanitize(userNote) : undefined,
        mapUrl: newMapUrl ?? undefined,
      };

      const updatedSection: SearchSection | IndicatorSection = {
        ...(currentSection ?? {}),
        ...sectionInfo,
        url: sectionUrl,
        graphs: [
          ...(currentSection?.graphs.filter((g) => g.id !== graphId) ?? []),
          newGraph,
        ],
      };

      setReportDownloaded(false);
      setDocSections((oldSections) =>
        new Map(oldSections).set(sectionId, updatedSection),
      );

      toast(uiText.context.addSectionToastSuccess.title, {
        position: "bottom-right",
        description: uiText.context.addSectionToastSuccess.description(
          sectionToAddInfo.sectionInfo.title,
        ),
        icon: <FileCheck className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
        duration: 4 * 1000,
      });
    },
    [docContext, docSections, reportType, user],
  );

  const addSectionToRegistry = useCallback((id: string, info: SectionInfo) => {
    sectionsRegistryRef.current.set(id, info);
  }, []);

  const removeSectionFromRegistry = useCallback((id: string) => {
    sectionsRegistryRef.current.delete(id);
  }, []);

  const addSectionFromRegistryToReport = useCallback(
    async (id: string, userNote?: string) => {
      const sectionToAdd = sectionsRegistryRef.current.get(id);
      if (!sectionToAdd) {
        console.warn(`'${id}' doesn't exist in the registry pool`);
        return;
      }

      await addSection(userNote, sectionToAdd);
    },
    [addSection],
  );

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
          setReportDownloaded(true);
          return new Map();
        }

        setReportDownloaded(false);
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
        ...uiText.context.removeSectionToastSuccess(sectionId),
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
        ...uiText.context.removeGraphToastSuccess(sectionId),
        icon: ChartLine,
      },
    });
  };

  const removeReport = () => {
    removeElements({
      toastInfo: {
        ...uiText.context.removeReportToastSuccess,
        icon: Shredder,
      },
    });
  };

  const moveElement = (
    direction: "prev" | "next",
    sectionId: string,
    graphStateId?: string,
  ) => {
    setReportDownloaded(false);

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

  const downloadReport = async () => {
    const whyDownloadSanitized = StrValidator.sanitize(whyDownload);
    if (!user || !whyDownloadSanitized) {
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
      if (!docContext) {
        return;
      }
      setIsLoading(true);

      const DocumentModelComponent = documentModels[reportType];
      const namePrefix = REPORT_DOWNLOAD_NAME_PREFIX[reportType];
      if (!DocumentModelComponent || !namePrefix) {
        setErrors(["No document model for the report"]);
        return;
      }

      const fileName = `${namePrefix}_${docMetadata.creationDate}.pdf`;
      const blob = await pdf(
        <DocumentModelComponent
          metadata={docMetadata}
          context={docContext}
          sections={docSections as Map<string, IndicatorSection>}
        />,
      ).toBlob();
      if (!blob) {
        setErrors(["No fue posible crear el PDF"]);
        return;
      }

      const pdfUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      void sendReportDownloadReason(
        whyDownloadSanitized,
        JSON.stringify(
          {
            name: `${user.firstName} ${user.lastName}`,
            organization: user.organization,
          },
          null,
          2,
        ),
      );

      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

      setReportDownloaded(true);
    } catch (error) {
      console.error(uiText.downloadReportError, error);
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
        userNote: newNote ? StrValidator.sanitize(newNote) : undefined,
      };
      newSections.set(sectionId, { ...sectionToWork, graphs: newGraphs });
      return newSections;
    });
  };

  const addLeaveCallback = useCallback((callback: () => void) => {
    leaveCallbackRef.current = callback;
    return () => {
      leaveCallbackRef.current = null; // cleanup
    };
  }, []);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const currentPath = currentLocation.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, -1)
      .join("/");
    const nextPath = nextLocation.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, -1)
      .join("/");

    const pathChange = currentPath !== nextPath;
    const searchChange = currentLocation.search !== nextLocation.search;

    return (
      (ReportType.SEARCH_INDICATORS === reportType && searchChange) ||
      pathChange
    );
  });

  useEffect(() => {
    if (blocker.state === "blocked" && reportDownloaded) {
      blocker.proceed();
      if (leaveCallbackRef.current) {
        leaveCallbackRef.current();
      }
    }
  }, [blocker, reportDownloaded]);

  useEffect(() => {
    return () => {
      removeElements({});
    };
  }, [removeElements]);

  return (
    <ReportContext.Provider
      value={{
        isLoading,
        errors,
        reportContextResolver,
        reportDownloaded,
        setCurrentSectionPool,
        hasSections: docSections.size > 0,
        addSection,
        removeGraph,
        removeSection,
        removeReport,
        updateNote,
        addSectionToRegistry,
        removeSectionFromRegistry,
        addSectionFromRegistryToReport,
        toggleEditor,
        whyDownload,
        setWhyDownload,
        moveElement,
        downloadReport,
        documentSections: docSections,
        addLeaveCallback,
      }}
    >
      <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <AnimatePresence>
          {isEditorOpen && (
            <SheetContent
              className="min-w-1 sm:min-w-3/4 lg:min-w-1/2 h-full flex flex-col"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                document.body.style.pointerEvents = "";
              }}
              onPointerDownOutside={() => {
                document.body.style.pointerEvents = "";
              }}
            >
              <SheetHeader className="border-muted shrink-0">
                <SheetTitle className="text-3xl text-primary m-0 font-normal">
                  {uiText.editor.header.title}
                </SheetTitle>
                <SheetDescription className="text-base text-primary m-0 max-w-[65ch] text-balance">
                  {uiText.editor.header.description}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto min-h-0 my-4 pr-1 scrollbar-custom">
                <ReportDocumentTree documentSections={docSections} />
              </div>

              <SheetFooter className="shrink-0 flex-col! gap-2 bg-muted border border-input hover:border-primary transition-colors duration-300">
                <div>
                  <label
                    htmlFor="whyDownload"
                    className="text-primary font-normal"
                  >
                    {uiText.editor.footer.input.label}
                  </label>
                  <InputGroup>
                    <TextareaAutosize
                      data-slot="input-group-control"
                      className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base! transition-[color,box-shadow] outline-none md:text-sm"
                      id="whyDownload"
                      name="whyDownload"
                      placeholder={uiText.editor.footer.input.placeholder}
                      value={whyDownload}
                      onChange={(e) => setWhyDownload(e.target.value)}
                      maxLength={REPORT_NOTE_MAX_LENGTH}
                    />
                    <InputGroupAddon
                      align="block-end"
                      className={`${inputWarnColor(
                        whyDownload,
                        REPORT_NOTE_MAX_LENGTH,
                        0.95,
                      )} flex-row-reverse`}
                    >
                      {whyDownload.length} / {REPORT_NOTE_MAX_LENGTH}
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div className="flex flex-row-reverse gap-2 justify-between">
                  <Button
                    disabled={
                      whyDownload === "" || docSections.size === 0 || isLoading
                    }
                    type="button"
                    onClick={() => {
                      void downloadReport();
                      setIsEditorOpen(false);
                    }}
                    title={uiText.editor.footer.downloadBtn.title}
                    aria-label={uiText.editor.footer.downloadBtn.sr}
                  >
                    <FileDown />
                    {uiText.editor.footer.downloadBtn.label}
                  </Button>
                  <ButtonGroup>
                    <SheetClose asChild>
                      <Button
                        variant="outline_destructive"
                        title={uiText.editor.footer.closeBtn.title}
                        aria-label={uiText.editor.footer.closeBtn.sr}
                      >
                        <CircleSlash />
                        {uiText.editor.footer.closeBtn.label}
                      </Button>
                    </SheetClose>
                    <Button
                      variant="outline_destructive"
                      disabled={docSections.size === 0}
                      title={uiText.editor.footer.deleteBtn.title}
                      aria-label={uiText.editor.footer.deleteBtn.sr}
                    >
                      <FileXIcon />
                      {uiText.editor.footer.deleteBtn.label}
                    </Button>
                  </ButtonGroup>
                </div>
              </SheetFooter>
            </SheetContent>
          )}
        </AnimatePresence>
      </Sheet>

      {children}

      <AlertDialog open={blocker.state === "blocked"}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{uiText.leaveAlert.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {uiText.leaveAlert.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => blocker.reset?.()}>
              {uiText.leaveAlert.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                blocker.proceed?.();
                if (leaveCallbackRef.current) {
                  leaveCallbackRef.current();
                }
              }}
            >
              {uiText.leaveAlert.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);

  if (!context) {
    throw new Error("useReportCTX must be within the ReportCTX");
  }

  return context;
}
