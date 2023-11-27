import React from "react";
import { Link } from "react-router-dom";

interface MenuButtonTypes {
  buttonStyles?: string;
  idBtn?: string;
  focusCallback?: () => void;
  firstLineContent?: string;
  secondLineContent?: string;
  externalLink?: string;
  localLink: string;
}

const MenuButton: React.FC<MenuButtonTypes> = ({
  buttonStyles = "",
  idBtn = "",
  focusCallback = () => {},
  firstLineContent = "",
  secondLineContent = "",
  externalLink = "",
  localLink = "",
}) => {
  const content = (
    <button
      type="button"
      className={buttonStyles}
      id={idBtn}
      onMouseOver={focusCallback}
      onFocus={focusCallback}
    >
      {`${firstLineContent} `}
      <b>{secondLineContent}</b>
    </button>
  );

  if (externalLink) {
    return (
      <a href={externalLink} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <Link to={localLink}>{content}</Link>;
};

export default MenuButton;
