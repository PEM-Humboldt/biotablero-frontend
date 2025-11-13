import type { Collaborators } from "@appTypes/layout";
import {
  collaboratorsData,
  footerInfo,
} from "core/layout/mainLayout/footer/footerData";

interface FooterProps {
  logos: Set<Collaborators>;
}

export function Footer({ logos }: FooterProps) {
  const handleCitationClick = () => {
    void navigator.clipboard.writeText(footerInfo.citationClipboard);
  };

  const collaborators = logos ? [...logos] : [];

  return (
    <footer className="flex justify-between items-center py-2! px-1!">
      <div>
        {collaborators.length > 0 && (
          <a href={footerInfo.IAVH.url}>
            <img src={footerInfo.IAVH.img} alt={footerInfo.IAVH.linkAlt} />
          </a>
        )}
        <div className="text-white mt-0.25!">
          {footerInfo.IAVH.tag}
          <br />
          <b>{footerInfo.IAVH.name}</b>
        </div>
      </div>

      <div className="colaboradoresDiv">
        {collaborators.length > 0 && (
          <div className="colaboradores flex">
            <span>{footerInfo.uiTxt.collaboratorsTitle}</span>
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
                />
              </a>
            ))}
          </div>
        )}

        <div className="footersm quoteStyle">
          <h3>
            <button
              type="button"
              title={footerInfo.citationTooltip}
              className="footerTooltip"
              onClick={handleCitationClick}
            >
              {footerInfo.uiTxt.links.citation}
            </button>
          </h3>
          <h3>
            <a href={`mailto:${footerInfo.IAVH.contact}`}>
              {footerInfo.uiTxt.links.contact}
            </a>
          </h3>
        </div>
      </div>
    </footer>
  );
}
