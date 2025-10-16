import { PlusIcon } from "@ui/IconsIndicators";

interface ItemTypes {
  title: string;
  year: string;
  description: string;
  link: string;
}

export function Item({ title, year, description, link }: ItemTypes) {
  return (
    <div className="portCard">
      <div className="pcTitle">{title}</div>
      <div className="pcDate">{year}</div>
      <p className="pcText">{description}</p>
      <div className="button-container">
        <div className="button">
          <a href={link} target="_blank" rel="noreferrer">
            <PlusIcon fontSize={30} color="#e84a60" />
          </a>
        </div>
      </div>
    </div>
  );
}
