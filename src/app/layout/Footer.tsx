import type { Collaborators } from "types/layoutTypes";
import { collaboratorsData, footerInfo } from "app/layout/footer/text";

interface FooterProps {
  collaboratorsId?: Set<Collaborators>;
}

export function Footer({ collaboratorsId }: FooterProps) {
  const handleCitationClick = () => {
    navigator.clipboard.writeText(footerInfo.citationClipboard);
  };

  const collaborators = collaboratorsId ? [...collaboratorsId] : [];

  return (
    <footer className="footerflex">
      <div className="institutoDiv">
        {collaborators.length > 0 && (
          <a href={footerInfo.IAVH.url}>
            <img src={footerInfo.IAVH.img} alt={footerInfo.IAVH.linkAlt} />
          </a>
        )}
        <div>
          {footerInfo.IAVH.tag}
          <br />
          <b>{footerInfo.IAVH.name}</b>
        </div>
      </div>

      <div className="colaboradoresDiv">
        {collaborators.length > 0 && (
          <div className="colaboradores">
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
