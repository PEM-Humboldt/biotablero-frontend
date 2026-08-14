import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { parseSimpleMarkdown } from "@utils/textParser";
import { uiText } from "pages/monitoring/outlets/help/layout/uiText";
import bgPrimary from "@assets/bg1Help.png";
import bgDecoration from "@assets/bg2Help.png";
import { HELP_VIDEO_URL } from "@config/monitoring";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";
import { useMemo, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { SearchIcon } from "lucide-react";
import { fuzzySearch } from "pages/monitoring/utils/search";

export function Help() {
  const [search, setSearch] = useState("");
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
    <div className="bg-primary w-full min-h-full">
      <PageTitleUpdater title="Ayuda" />

      <div>
        <h3>{uiText.title}</h3>
        <a href={HELP_VIDEO_URL} target="_blank">
          video tutorial
        </a>
        <div>{parseSimpleMarkdown(uiText.descriptionMd)}</div>
      </div>

      <div>
        <label htmlFor="search" className="sr-only">
          Buscar por palabra clave
        </label>
        <InputGroup>
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

        <Accordion type="multiple">
          {questionsSearched.map((section) => (
            <AccordionItem
              key={`qSection_${section.title}`}
              value={section.title}
            >
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <Accordion type="single" collapsible>
                  {section.content.map((question) => (
                    <AccordionItem key={question.title} value={question.title}>
                      <AccordionTrigger>{question.title}</AccordionTrigger>
                      <AccordionContent>
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
