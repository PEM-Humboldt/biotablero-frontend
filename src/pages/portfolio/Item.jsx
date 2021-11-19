import React from 'react';
import PropTypes from 'prop-types';
import PlusIcon from 'pages/portfolio/PlusIcon';

const Item = (props) => {
  const {
    title,
    year,
    description,
    link,
  } = props;
  return (
    <div className="portCard">
      <div className="pcTitle">
        {title}
      </div>
      <div className="pcDate">
        {year}
      </div>
      <p className="pcText">
        {description}
      </p>
      <div className="button-container">
        <div className="button">
          <a href={link} target="_blank" rel="noreferrer">
            <PlusIcon fontSize={19} color="#e84a60" />
          </a>
        </div>
      </div>
    </div>
  );
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default Item;
