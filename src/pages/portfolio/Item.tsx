import React from "react";
import PlusIcon from "pages/portfolio/PlusIcon";

interface ItemTypes {
  title: string;
  year: string;
  description: string;
  link: string;
}

const Item: React.FC<ItemTypes> = (props) => {
  const { title, year, description, link } = props;
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
};

export default Item;
