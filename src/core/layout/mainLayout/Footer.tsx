import type { Collaborators } from "@appTypes/layout";
import { collaboratorsIcons } from "@assets/dictionaries/collaboratorsIcons";
import { uiText } from "core/layout/mainLayout/footer/layout/uiText";
import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";

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
        "bg-grey-dark p-4 md:px-8 flex text-background justify-between items-start",
        className,
      )}
    >
      <div>
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

      <div className="text-right">
        {collaborators.length > 0 && (
          <>
            <div className="text-sm mb-2">
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
                    className="object-contain object-center w-14 h-8 md:w-18 md:h-12 "
                  />
                </a>
              ))}
            </div>
          </>
        )}

        <div className="text-right mt-2">
          <Button
            title={uiText.citationTooltip}
            variant="link"
            className="text-accent text-sm"
            onClick={handleCitationClick}
          >
            {uiText.uiTxt.links.citation}
          </Button>
          <a
            href={`mailto:${uiText.IAVH.contact}`}
            className="underline-offset-4 text-sm hover:underline hover:text-accent text-accent font-normal"
          >
            {uiText.uiTxt.links.contact}
          </a>
        </div>
      </div>
    </footer>
  );
}
