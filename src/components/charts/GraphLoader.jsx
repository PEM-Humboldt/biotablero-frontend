import PropTypes from 'prop-types';
import React from 'react';

import SingleBulletGraph from 'components/charts/SingleBulletGraph';
import LargeBarStackGraph from 'components/charts/LargeBarStackGraph';
import MultiLinesGraph from 'components/charts/MultiLinesGraph';
import MultiSmallBarStackGraph from 'components/charts/MultiSmallBarStackGraph';
import MultiSmallSingleBarGraph from 'components/charts/MultiSmallSingleBarGraph';
import PieGraph from 'components/charts/PieGraph';
import SmallBarStackGraph from 'components/charts/SmallBarStackGraph';

const GraphLoader = (props) => {
  const {
    graphType,
    data,
    colors,
    labelX,
    labelY,
    units,
    padding,
    onClickGraphHandler,
    markers,
    message,
    selectedIndexValue,
    yMax,
    reverse,
    labelXRight,
    labelXLeft,
  } = props;

  let errorMessage = null;
  // TODO: don't relay on data being null for a loading state
  if (data === null || message === 'loading') {
    errorMessage = 'Cargando información...';
  } else if (!data || data.length <= 0 || Object.keys(data).length === 0 || message === 'no-data') {
    errorMessage = 'Información no disponible';
  }
  if (errorMessage) {
    return (
      <div className="errorData">
        {errorMessage}
      </div>
    );
  }

  switch (graphType) {
    case 'LargeBarStackGraph':
      return (
        <LargeBarStackGraph
          data={data}
          labelX={labelX}
          labelY={labelY}
          height={150}
          colors={colors}
          padding={padding}
          units={units}
          onClickGraphHandler={onClickGraphHandler}
        />
      );
    case 'SmallBarStackGraph':
      return (
        <SmallBarStackGraph
          data={data}
          height={30}
          colors={colors}
          units={units}
          onClickGraphHandler={onClickGraphHandler}
        />
      );
    case 'MultiSmallBarStackGraph':
      return (
        <MultiSmallBarStackGraph
          data={data}
          height={250}
          colors={colors}
          units={units}
          onClickHandler={onClickGraphHandler}
          selectedIndexValue={selectedIndexValue}
        />
      );
    case 'MultiSmallSingleBarGraph':
      return (
        <MultiSmallSingleBarGraph
          data={data}
          height={250}
          colors={colors}
          units={units}
          onClickHandler={onClickGraphHandler}
          selectedIndexValue={selectedIndexValue}
          labelX={labelX}
        />
      );
    case 'pie':
      return (
        <PieGraph
          data={data}
          height={450}
          units={units}
          colors={colors}
          onClickHandler={onClickGraphHandler}
        />
      );
    case 'singleBullet':
      return (
        <SingleBulletGraph
          data={data}
          height={62}
          colors={colors}
          onClickHandler={onClickGraphHandler}
          reverse={reverse}
          labelXRight={labelXRight}
          labelXLeft={labelXLeft}
        />
      );
    case 'MultiLinesGraph':
      return (
        <MultiLinesGraph
          onClickGraphHandler={onClickGraphHandler}
          colors={colors}
          data={data}
          markers={markers}
          height={490}
          units={units}
          yMax={yMax}
        />
      );
    default:
      return <></>;
  }
};

GraphLoader.propTypes = {
  graphType: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  units: PropTypes.string,
  yMax: PropTypes.number,
  // TODO: Remove array type once the charts in compensation are migrated
  colors: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
  ]),
  padding: PropTypes.number,
  onClickGraphHandler: PropTypes.func,
  markers: PropTypes.arrayOf(PropTypes.shape({
    axis: PropTypes.string,
    value: PropTypes.number,
    type: PropTypes.string,
    legendPosition: PropTypes.string,
  })),
  selectedIndexValue: PropTypes.string,
  reverse: PropTypes.bool,
  labelXRight: PropTypes.string,
  labelXLeft: PropTypes.string,
  message: PropTypes.string,
};

GraphLoader.defaultProps = {
  graphTitle: '',
  activeBiome: '',
  labelX: '',
  labelY: '',
  showOnlyTitle: false,
  units: '',
  yMax: 100,
  elementOnClick: () => {},
  colors: () => {},
  padding: 0.25,
  onClickGraphHandler: () => {},
  markers: [],
  message: null,
  selectedIndexValue: '',
  reverse: false,
  labelXRight: null,
  labelXLeft: null,
};

export default GraphLoader;
