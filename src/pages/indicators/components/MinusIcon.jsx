import PropTypes from "prop-types";

import { SvgIcon } from "@material-ui/core";

const MinusIcon = ({ color, fontSize }) => (
  <SvgIcon
    style={{ color, fontSize }}
    width="29"
    height="29"
    viewBox="0 0 21.97 21.97"
  >
    <path
      className="cls-minus"
      d="M30.64,41.22a11,11,0,1,1,11-11A11,11,0,0,1,30.64,41.22Zm0-21a10,10,0,1,0,10,10A10,10,0,0,0,30.64,20.25Zm6.37,10a.76.76,0,0,0-.75-.75H25A.75.75,0,0,0,25,31H36.26A.75.75,0,0,0,37,30.23Z"
      transform="translate(-19.65 -19.25)"
    />
  </SvgIcon>
);

MinusIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

MinusIcon.defaultProps = {
  color: "#fff",
  fontSize: 20,
};

export default MinusIcon;
