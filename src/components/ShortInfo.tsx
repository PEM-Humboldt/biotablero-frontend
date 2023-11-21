import React, { useState } from "react";
// import PropTypes from 'prop-types';
import isUndefinedOrNull from "utils/validations";

interface ShortInfoTypes {
  className: string;
  description: string;
  tooltip?: string;
  collapseButton: boolean;
}

const ShortInfo: React.FC<ShortInfoTypes> = ({
  description,
  tooltip,
  collapseButton = true,
  className,
}) => {
  const [rotate_button, setRotate_button] = useState(true);
  const [hide_text, setHide_text] = useState(true);

  const handleClick = () => {
    setRotate_button(!rotate_button);
    setHide_text(!hide_text);
  };

  return (
    <div>
      <div
        className={`${className}-${hide_text}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `${
            isUndefinedOrNull(description) ? "Cargando..." : description
          }`,
        }}
      />
      {collapseButton && (
        <button
          type="button"
          className={`showHome rotate-${hide_text}`}
          title={tooltip}
          aria-label={tooltip}
          onClick={handleClick}
        />
      )}
    </div>
  );
};

// class ShortInfo2 extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       rotate_button: true,
//       hide_text: true,
//     };
//   }

//   handleClick = () => {
//     const { rotate_button: rotateButton, hide_text: hideText } = this.state;
//     this.setState({
//       rotate_button: !rotateButton,
//       hide_text: !hideText,
//     });
//   }

//   render() {
//     const { hide_text: hideText } = this.state;
//     const {
//       description, tooltip, collapseButton, className,
//     } = this.props;
//     return (
//       <div>
//         <div
//           className={`${className}-${hideText}`}
//           // eslint-disable-next-line react/no-danger
//           dangerouslySetInnerHTML={{ __html: `${isUndefinedOrNull(description) ? 'Cargando...' : description}` }}
//         />
//         {collapseButton && (
//           <button
//             type="button"
//             className={`showHome rotate-${hideText}`}
//             title={tooltip}
//             aria-label={tooltip}
//             onClick={this.handleClick}
//           />
//         )}
//       </div>
//     );
//   }
// }

// ShortInfo.propTypes = {
//   className: PropTypes.string,
//   description: PropTypes.string,
//   tooltip: PropTypes.string,
//   collapseButton: PropTypes.bool,
// };

// ShortInfo.defaultProps = {
//   className: 'hidden',
//   description: '',
//   tooltip: '',
//   collapseButton: true,
// };

export default ShortInfo;
