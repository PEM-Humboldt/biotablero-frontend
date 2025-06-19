import PropTypes from 'prop-types';

import Accordion from 'pages/search/Accordion';

const Richness = (props) => {
  const {
    handleAccordionChange
  } = props;

  const componentsArray = [ ];
  return (
    <div style={{ width: '100%' }}>
      <Accordion
        componentsArray={componentsArray}
        classNameDefault="m1"
        classNameSelected="m1 accordionSelected"
        handleChange={handleAccordionChange}
        level="2"
      />
    </div>
  );
};

Richness.propTypes = {
  handleAccordionChange: PropTypes.func
};

Richness.defaultProps = {
  handleAccordionChange: () => {}
};

export default Richness;
