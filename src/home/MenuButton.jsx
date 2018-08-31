/** eslint verified */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MenuButton = ({
  buttonStyles, idBtn, focusCallback, firstLineContent, secondLineContent, externalLink, localLink,
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
      <b>
        {secondLineContent}
      </b>
    </button>
  );

  if (externalLink) {
    return (
      <a
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }
  return (
    <Link to={localLink}>
      {content}
    </Link>
  );
};

MenuButton.propTypes = {
  buttonStyles: PropTypes.string,
  idBtn: PropTypes.string,
  focusCallback: PropTypes.func,
  firstLineContent: PropTypes.string,
  secondLineContent: PropTypes.string,
  externalLink: PropTypes.string,
  localLink: PropTypes.string,
};

MenuButton.defaultProps = {
  buttonStyles: '',
  idBtn: '',
  focusCallback: null,
  firstLineContent: '',
  secondLineContent: '',
  externalLink: '',
  localLink: '',
};

export default MenuButton;
