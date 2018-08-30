/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ title, subTitle }) => {
  let result = null;
  if (subTitle) {
    result = (
      <div className="interna">
        <h3>
          <b>
            {title}
          </b>
        </h3>
        <h5>
          {subTitle}
        </h5>
      </div>
    );
  } else {
    result = (
      <h3>
        <b>
          {title}
        </b>
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
