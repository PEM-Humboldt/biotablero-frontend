/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  title, description, period, action,
}) => (
  <div className="item">
    <h1>
      {title}
    </h1>
    <h2>
      {description}
    </h2>
    <h3>
      {period}
    </h3>
    <br />
    {action}
  </div>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  period: PropTypes.string,
  action: PropTypes.string.isRequired,
};

Card.defaultProps = {
  description: '',
  period: '',
};

export default Card;
