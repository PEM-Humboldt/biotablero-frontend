import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

interface Props {
  title: string;
  subTitle: string;
}

const Title: React.FunctionComponent<Props> = ({ title, subTitle }: Props) => (
  <div className={subTitle ? 'interna' : 'cabezoteRight'}>
    <h3>
      <Link to="/">
        <b>
          {title}
        </b>
      </Link>
    </h3>
    {subTitle && (
      <h5>
        {subTitle}
      </h5>
    )}
  </div>
);

// Title.propTypes = {
//   title: PropTypes.string,
//   subTitle: PropTypes.string,
// };

// Title.defaultProps = {
//   title: '',
//   subTitle: '',
// };

export default Title;
