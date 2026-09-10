import { Link } from "react-router";

import type { Collaborators } from "@appTypes/layout";
import { collaboratorsIcons } from "@assets/dictionaries/collaboratorsIcons";
import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";

import { uiText } from "core/layout/mainLayout/footer/layout/uiText";
import { ButtonGroup } from "@mui/material";

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
      className={cn(
        "bg-grey-dark p-4 pt-1 md:px-8 flex text-background justify-between items-start",
        className,
      )}
    >
      <div className="pt-3">
        {collaborators.length > 0 && (
          <a href={uiText.IAVH.url}>
            <img
              src={uiText.IAVH.img}
              alt={uiText.IAVH.linkAlt}
              className="w-12 h-12 md:w-18 md:h-18"
            />
          </a>
        )}
        <div className="text-sm mt-1">
          {uiText.IAVH.tag}
          <br />
          <b>{uiText.IAVH.name}</b>
        </div>
      </div>

      <div className="text-right space-y-4">
        <ButtonGroup className="space-x-2">
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

        {collaborators.length > 0 && (
          <>
            <div className="text-sm font-normal mb-1">
              {uiText.uiTxt.collaboratorsTitle}
            </div>
            <div className="flex flex-wrap gap-4 justify-end">
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
                    className="object-contain object-center w-14 h-8 md:w-18 md:h-12"
                  />
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
