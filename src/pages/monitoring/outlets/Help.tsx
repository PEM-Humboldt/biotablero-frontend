import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { parseSimpleMarkdown } from "@utils/textParser";
import { uiText } from "pages/monitoring/outlets/help/layout/uiText";
import bgPrimary from "@assets/bg1Help.png";
import bgDecoration from "@assets/bg2Help.png";
import { HELP_YOUTUBE_VIDEO_ID } from "@config/monitoring";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";
import { useEffect, useMemo, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { PlayIcon, SearchIcon } from "lucide-react";
import { fuzzySearch } from "pages/monitoring/utils/search";
import {
  getYoutubeVideoMetadata,
  type YoutubeVideoMetadata,
} from "pages/monitoring/api/services/youtube";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export function Help() {
  const [search, setSearch] = useState("");
  const [video, setVideoInfo] = useState<YoutubeVideoMetadata | null>(null);

  useEffect(() => {
    async function fetchVideoInfo() {
      const res = await getYoutubeVideoMetadata(HELP_YOUTUBE_VIDEO_ID);

      if (isMonitoringAPIError(res)) {
        setVideoInfo(null);
      } else {
        setVideoInfo(res);
      }
    }

    void fetchVideoInfo();
  }, []);

  const styledTexts = useMemo(
    () =>
      uiText.faq.map((category) => ({
        title: category.title,
        content: category.cotent.map((question) => ({
          title: question.title,
          description: parseSimpleMarkdown(question.descriptionMd),
        })),
      })),
    [],
  );

  const questionsSearched = useMemo(() => {
    const sanitizedSearch = search
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLocaleLowerCase();

    if (!sanitizedSearch) {
      return styledTexts;
    }

    return styledTexts
      .map((section) => {
        const filteredContent = section.content.filter((question) => {
          const sanitizedTitle = question.title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase();

          return fuzzySearch(sanitizedSearch, sanitizedTitle);
        });

        return {
          ...section,
          content: filteredContent,
        };
      })
      .filter((section) => section.content.length > 0);
  }, [styledTexts, search]);

  return (
    <div
      className="w-full min-h-full bg-(image:--bg-mobile) lg:bg-(image:--bg-desktop) bg-no-repeat p-8 flex flex-col gap-8"
      style={
        {
          "--bg-mobile": `url(${bgDecoration})`,
          "--bg-desktop": `url(${bgDecoration}), url(${bgPrimary})`,

          backgroundPosition: "10% bottom, top right",
          backgroundSize: "200px, auto 800px",
        } as React.CSSProperties
      }
    >
      <PageTitleUpdater title="Ayuda" />

      <div className="space-y-4">
        <h3 className="text-primary text-3xl font-normal">{uiText.title}</h3>
        <div className="max-w-65ch">
          {parseSimpleMarkdown(uiText.descriptionMd)}
        </div>
        {video && (
          <figure
            key={video.url}
            className="group relative rounded overflow-hidden outline outline-primary/50 hover:outline-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
            title="Video tutorial"
          >
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300">
                <PlayIcon
                  className="text-background bg-primary/90 p-2 rounded-full size-12 group-hover:bg-accent transition-colors duration-300"
                  strokeWidth={1}
                />
              </div>

              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full"
              />

              <figcaption className="absolute bottom-0 bg-background/90 w-full px-3 py-2 text-base truncate">
                {video.title}
              </figcaption>
            </a>
          </figure>
        )}
      </div>

      <div className="">
        <h3 className="text-primary text-3xl font-normal">{uiText.faqTitle}</h3>
        <label htmlFor="search" className="sr-only">
          Buscar por palabra clave
        </label>
        <InputGroup className="mb-4">
          <InputGroupInput
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busca por palara clave..."
          />
          <InputGroupAddon align="inline-end">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <Accordion type="multiple" className="space-y-2">
          {questionsSearched.map((section) => (
            <AccordionItem
              key={`qSection_${section.title}`}
              value={section.title}
            >
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <Accordion type="single" collapsible>
                  {section.content.map((question) => (
                    <AccordionItem
                      key={question.title}
                      value={question.title}
                      className="bg-background! outline-none! rounded-none border-b last:border-b-0 border-muted my-2 shadow-none! data-[state=open]:shadow-none!"
                    >
                      <AccordionTrigger className="bg-transparent! text-primary! hover:bg-transparent! hover:text-accent! data-[state=open]:bg-transparent! data-[state=open]:text-primary! px-0">
                        {question.title}
                      </AccordionTrigger>
                      <AccordionContent className="">
                        {question.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
