import React from 'react';
import PropTypes from 'prop-types';
import isUndefinedOrNull from 'utils/validations';

class ShortInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate_button: true,
      hide_text: true,
    };
  }

  handleClick = () => {
    const { rotate_button: rotateButton, hide_text: hideText } = this.state;
    this.setState({
      rotate_button: !rotateButton,
      hide_text: !hideText,
    });
  }

  render() {
    const { hide_text: hideText } = this.state;
    const {
      name, description, tooltip, collapseButton, className,
    } = this.props;
    return (
      <div>
        <div
          className={`${className}-${hideText}`}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: `<p><b>${name}</b> ${isUndefinedOrNull(description) ? 'Cargando...' : description}</p>` }}
        />
        {collapseButton && (
          <button
            type="button"
            className={`showHome rotate-${hideText}`}
            title={tooltip}
            aria-label={tooltip}
            onClick={this.handleClick}
          />
        )}
      </div>
    );
  }
}

ShortInfo.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  description: PropTypes.string,
  tooltip: PropTypes.string,
  collapseButton: PropTypes.bool,
};

ShortInfo.defaultProps = {
  name: '',
  className: 'hidden',
  description: '',
  tooltip: '',
  collapseButton: true,
};

export default ShortInfo;
