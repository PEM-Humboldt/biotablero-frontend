import type { Collaborators } from "@appTypes/layout";
import {
  collaboratorsData,
  footerInfo,
} from "core/layout/mainLayout/footer/footerData";
import { Button } from "@ui/shadCN/component/button";

interface FooterProps {
  logos: Set<Collaborators>;
}

export function Footer({ logos }: FooterProps) {
  const handleCitationClick = () => {
    void navigator.clipboard.writeText(footerInfo.citationClipboard);
  };

  const collaborators = logos ? [...logos] : [];

  return (
    <footer className="bg-grey-dark p-4 md:px-8 flex text-background justify-between items-start">
      <div>
        {collaborators.length > 0 && (
          <a href={footerInfo.IAVH.url}>
            <img
              src={footerInfo.IAVH.img}
              alt={footerInfo.IAVH.linkAlt}
              className="w-12 h-12 md:w-18 md:h-18"
            />
          </a>
        )}
        <div className="text-sm mt-1">
          {footerInfo.IAVH.tag}
          <br />
          <b>{footerInfo.IAVH.name}</b>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm mb-2">
          {footerInfo.uiTxt.collaboratorsTitle}
        </div>
        {collaborators.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-end">
            {collaborators.map((collaborator) => (
              <a
                href={collaboratorsData[collaborator].url}
                target="_blank"
                rel="noopener noreferrer"
                key={collaborator}
              >
                <img
                  src={collaboratorsData[collaborator].img}
                  alt={collaborator}
                  className="object-contain object-center w-14 h-8 md:w-18 md:h-12 "
                />
              </a>
            ))}
          </div>
        )}

        <div className="text-right mt-2 text-sm">
          <Button
            title={footerInfo.citationTooltip}
            variant="link"
            className="text-accent"
            onClick={handleCitationClick}
          >
            {footerInfo.uiTxt.links.citation}
          </Button>
          <a
            href={`mailto:${footerInfo.IAVH.contact}`}
            className="underline-offset-4 hover:underline! hover:text-accent text-accent font-normal"
          >
            {footerInfo.uiTxt.links.contact}
          </a>
        </div>
      </div>
    </footer>
  );
}
