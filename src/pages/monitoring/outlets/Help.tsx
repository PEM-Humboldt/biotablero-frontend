import { useEffect, useMemo, useState } from "react";
import { PlayIcon, RotateCcw, SearchIcon } from "lucide-react";

import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { parseSimpleMarkdown } from "@utils/textParser";
import bgPrimary from "@assets/bg1Help.png";
import bgDecoration from "@assets/bg2Help.png";
import { HELP_YOUTUBE_VIDEO_URL } from "@config/monitoring";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";

import { fuzzySearch } from "pages/monitoring/utils/search";
import {
  getCleanYoutubeId,
  getYoutubeVideoMetadata,
  type YoutubeVideoMetadata,
} from "pages/monitoring/api/services/youtube";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { StrValidator } from "@utils/strValidator";
import { uiText } from "pages/monitoring/outlets/help/layout/uiText";

export function Help() {
  const [search, setSearch] = useState("");
  const [video, setVideoInfo] = useState<YoutubeVideoMetadata | null>(null);

  useEffect(() => {
    async function fetchVideoInfo() {
      const res = await getYoutubeVideoMetadata(
        getCleanYoutubeId(HELP_YOUTUBE_VIDEO_URL),
      );

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
      uiText.faq.map((category, i) => ({
        title: `${i + 1}. ${category.title}`,
        content: category.content.map((question) => ({
          title: question.title,
          description: parseSimpleMarkdown(question.descriptionMd),
        })),
      })),
    [],
  );

  const questionsSearched = useMemo(() => {
    const sanitizedSearch = StrValidator.normalize(search);

    if (!sanitizedSearch) {
      return styledTexts;
    }

    return styledTexts
      .map((section) => {
        const filteredContent = section.content.filter((question) => {
          const sanitizedTitle = StrValidator.normalize(question.title);

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
      className={cn(
        "w-full min-h-full bg-(image:--bg-mobile) lg:bg-(image:--bg-desktop) bg-no-repeat",
        "grid grid-cols-1 gap-10 p-4 [&_p]:max-w-[65ch]!",
        "lg:p-12 lg:items-center lg:grid-cols-2",
        "xl:grid-cols-[minmax(0,600px)_minmax(0,800px)] xl:justify-center xl:gap-[5%]",
      )}
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

      <div className="space-y-4 bg-background/70 p-4 backdrop-blur rounded-lg">
        <h3 className="text-primary text-3xl font-normal">{uiText.title}</h3>
        <div className="max-w-65ch">
          {parseSimpleMarkdown(uiText.descriptionMd)}
        </div>
        {video && (
          <figure
            key={video.url}
            className="group relative rounded overflow-hidden outline outline-primary/50 hover:outline-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
            title={uiText.video.title}
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

      <div className="space-y-2 bg-background p-4 shadow-2xl rounded-lg">
        <h3 className="text-primary text-3xl font-normal">{uiText.faqTitle}</h3>
        <label htmlFor="search" className="sr-only">
          {uiText.search.barSr}
        </label>
        <div className="flex gap-2">
          <InputGroup className="mb-4">
            <InputGroupInput
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={uiText.search.placeholder}
            />
            <InputGroupAddon align="inline-end">
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            variant="outline"
            disabled={search.length === 0}
            title={uiText.search.cleanBtn.title}
            aria-label={uiText.search.cleanBtn.sr}
          >
            <RotateCcw />
          </Button>
        </div>

        <Accordion
          type="multiple"
          className="rounded-lg! border border-primary/30 overflow-hidden"
        >
          {questionsSearched.map((section) => (
            <AccordionItem
              key={`qSection_${section.title}`}
              value={section.title}
              className="rounded-none border-t outline-none first:border-t-0 border-primary/30"
            >
              <AccordionTrigger className="rounded-none bg-background">
                {section.title}
              </AccordionTrigger>
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
                      <AccordionContent className="pb-4">
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
