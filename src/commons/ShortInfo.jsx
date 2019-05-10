/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

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
      name, description, tooltip, customButton, className,
    } = this.props;
    return (
      <div>
        <div
          className={`${className}-${hideText}`}
        >
          <p>
            <b>
              {name}
            </b>
            {description && (` ${description}`)}
          </p>
        </div>
        {!customButton && (
          <button
            type="button"
            id="showHome"
            className={`showHome rotate-${hideText}`}
            data-tooltip
            title={tooltip}
            onClick={this.handleClick}
          />
        )}
        {customButton && (
          <div
            className={`${customButton}-${hideText}`}
            title={tooltip}
          />
        )}
      </div>
    );
  }
}

ShortInfo.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  description: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
  customButton: PropTypes.bool,
};

ShortInfo.defaultProps = {
  className: 'hidden',
  description: NaN,
  customButton: false,
};

export default ShortInfo;
