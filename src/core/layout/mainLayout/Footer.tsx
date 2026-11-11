import { Link } from "react-router";

import type { Collaborators } from "@appTypes/layout";
import { collaboratorsIcons } from "@assets/dictionaries/collaboratorsIcons";
import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";

import { uiText } from "core/layout/mainLayout/footer/layout/uiText";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

interface FooterProps {
  logos: Set<Collaborators>;
  className?: string;
}

export function Footer({ logos, className }: FooterProps) {
  const handleCitationClick = () => {
    void navigator.clipboard.writeText(uiText.citationClipboard);
  };

  const collaborators = logos ? [...logos] : [];

  return (
    <footer
      className={cn("bg-grey-dark p-4 pt-1 md:px-8 text-background", className)}
    >
      <ButtonGroup className="gap-2 ml-auto mb-2 lg:mb-0">
        <Button
          title={uiText.citationTooltip}
          variant="link"
          size="sm"
          className="p-0 text-accent text-sm"
          onClick={handleCitationClick}
        >
          {uiText.uiTxt.links.citation}
        </Button>
        <Button
          title={uiText.tosTooltip}
          variant="link"
          size="sm"
          className="p-0 text-accent text-sm"
          asChild
        >
          <a href={`mailto:${uiText.IAVH.contact}`}>
            {uiText.uiTxt.links.contact}
          </a>
        </Button>
        <Button
          title={uiText.tosTooltip}
          variant="link"
          size="sm"
          className="p-0 **:p-0 text-accent text-sm"
          asChild
        >
          <Link to="TerminosCondiciones">{uiText.uiTxt.links.tos}</Link>
        </Button>
      </ButtonGroup>

      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
        <div className="flex gap-2 xl:flex-col items-center xl:items-start">
          {collaborators.length > 0 && (
            <a href={uiText.IAVH.url}>
              <img
                src={uiText.IAVH.img}
                alt={uiText.IAVH.linkAlt}
                className="object-contain object-center w-16 h-16 md:w-18 md:h-18"
              />
            </a>
          )}
          <div className="text-sm text-balance">
            {uiText.IAVH.tag}
            <br />
            <b>{uiText.IAVH.name}</b>
          </div>
        </div>

        {collaborators.length > 0 && (
          <div className="flex-1">
            <div className="text-sm font-normal m-1 md:text-right">
              {uiText.uiTxt.collaboratorsTitle}
            </div>

            <div className="flex flex-wrap w-full gap-4 justify-evenly md:justify-end">
              {collaborators.map((collaborator) => (
                <a
                  href={collaboratorsIcons[collaborator].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={collaborator}
                >
                  <img
                    src={collaboratorsIcons[collaborator].img}
                    alt={collaborator}
                    className="object-contain object-center w-18 h-12"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
