/** eslint verified */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Title = ({ title, subTitle }) => {
  let result = null;
  if (subTitle) {
    result = (
      <div className="interna">
        <h3>
          <Link to="/">
            <b>
              {title}
            </b>
          </Link>
        </h3>
        <h5>
          {subTitle}
        </h5>
      </div>
    );
  } else {
    result = (
      <h3>
        <Link to="/">
          <b>
            {title}
          </b>
        </Link>
      </h3>
    );
  }
  return result;
};

Title.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

Title.defaultProps = {
  title: '',
  subTitle: '',
};

export default Title;
