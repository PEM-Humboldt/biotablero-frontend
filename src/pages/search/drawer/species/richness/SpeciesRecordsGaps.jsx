import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import { IconTooltip } from 'components/Tooltips';
import GraphLoader from 'components/charts/GraphLoader';
import { LineLegend, LegendColor } from 'components/CssLegends';
import matchColor from 'utils/matchColor';
import ShortInfo from 'components/ShortInfo';
import SearchContext from 'pages/search/SearchContext';
import RestAPI from 'utils/restAPI';
import { SpeciesRecordsGapsTexts } from 'pages/search/drawer/species/richness/InfoTexts';

import isFlagEnabled from 'utils/isFlagEnabled';
import TextBoxes from 'components/TextBoxes';

const {
  info,
  meto,
  cons,
  quote,
} = SpeciesRecordsGapsTexts;

const areaTypeName = (areaType) => {
  switch (areaType) {
    case 'states':
      return 'departamentos';
    case 'ea':
      return 'jurisdicciones ambientales';
    case 'basinSubzones':
      return 'subzonas hidrográficas';
    default:
      return 'cerca';
  }
};

const getLabelGaps = (key, areaType, region) => (
  {
    value: 'Promedio de vacios en el área de consulta',
    min: 'Menos vacíos en el área de consulta',
    max: 'Más vacíos en el área de consulta',
    min_region: `Menos vacíos en la región ${region}`,
    max_region: `Más vacíos en la región ${region}`,
    min_threshold: `Menos vacíos ${areaTypeName(areaType)} de la región ${region}`,
    max_threshold: `Más vacíos ${areaTypeName(areaType)} de la región ${region}`,
  }[key]
);

const getLabelConcentration = (key) => ({
  min: 'Mínimo del área de consulta',
  max: 'Máximo del área de consulta',
  min_region: 'Mínimo por región biótica',
  max_region: 'Máximo por región biótica',
  min_threshold: 'Mínimo nacional',
  max_threshold: 'Máximo nacional',
  value: 'Promedio de representación en el área de consulta',
}[key]
);

class SpeciesRecordsGaps extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      gaps: {},
      concentration: {},
      messageGaps: 'loading',
      messageConc: 'loading',
      selected: 'gaps',
      bioticRegion: 'Región Biótica',
      concentrationFlag: false,
      showErrorMessage: false,
      csvData: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    switchLayer('speciesRecordsGaps');

    RestAPI.requestGaps(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          const showErrorMessage = (
            res[0].min < res[0].min_region
            || res[0].max > res[0].max_region
            );
          const { region, ...data } = this.transformData(res);
          const dataArray = [];
          dataArray.push(data);
          this.setState({
            gaps: data,
            messageGaps: null,
            bioticRegion: region,
            showErrorMessage,
            csvData: dataArray,
          });
        }
      })
      .catch(() => {
        this.setState({ messageGaps: 'no-data' });
      });

    RestAPI.requestConcentration(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          const { region, ...data } = this.transformData(res);
          const dataArray = [];
          dataArray.push(data);
          this.setState({
            concentration: data,
            messageConc: null,
            bioticRegion: region,
            csvData: dataArray,
          });
        }
      })
      .catch(() => {
        this.setState({ messageConc: 'no-data' });
      });

    isFlagEnabled('speciesRecordsConcentrarion')
      .then((value) => this.setState({ concentrationFlag: value }));
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Transform data structure to be passed to graph component as a prop
   *
   * @param {Object} rawData raw data from RestAPI
   */
  transformData = (rawData) => {
    const {
      id,
      avg,
      region_name: regionName,
      ...limits
    } = rawData[0];
    Object.keys(limits).forEach((key) => {
      Object.defineProperty(limits, key, { value: Math.round(limits[key] * 100) });
    });
    return {
      region: regionName,
      id,
      ranges: {
        area: Math.max(limits.max, limits.max_threshold, limits.max_region),
      },
      markers: {
        value: avg * 100,
      },
      measures: limits,
      title: '',
    };
  };

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const { areaId, geofenceId } = this.context;
    const {
      showInfoGraph,
      messageGaps,
      messageConc,
      gaps,
      concentration,
      selected,
      bioticRegion,
      concentrationFlag,
      showErrorMessage,
      csvData,
    } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {(
          showInfoGraph && (
          <ShortInfo
            description={info}
            className="graphinfo2"
            collapseButton={false}
          />
          )
        )}
        {showErrorMessage && (
          <div className="disclaimer">
            Los vacíos en el área de consulta son mayores o menores que los de la región biótica
            ya que sus límites intersectan dos o más regiones bióticas.
          </div>
        )}
        <div className={`nos-title${selected === 'gaps' ? ' selected' : ''}`}>
          Vacios de datos
        </div>
        <div className="svgPointer">
          <GraphLoader
            message={messageGaps}
            data={gaps}
            graphType="singleBullet"
            colors={matchColor('richnessGaps')}
            onClickGraphHandler={() => { this.setState({ selected: 'gaps' }); }}
            labelXLeft="Muchos datos"
            labelXRight="Pocos datos"
          />
        </div>
        <br />
        <div className="richnessLegend">
          {messageGaps === null && (
            <LegendColor
              orientation="column"
              color={matchColor('richnessGaps')('value')}
              key="value"
              marginLeft="2px"
              marginRight="6px"
            >
              {getLabelGaps('value', areaId)}
            </LegendColor>
          )}
          {messageGaps === null && gaps.measures && Object.keys(gaps.measures).map((key) => (
            <LineLegend
              orientation="column"
              color={matchColor('richnessGaps')(key)}
              key={key}
            >
              {getLabelGaps(key, areaId, bioticRegion)}
            </LineLegend>

          ))}
        </div>
        <TextBoxes
          consText={cons}
          metoText={meto}
          quoteText={quote}
          downloadData={csvData}
          downloadName={`vacios_registros_${areaId}_${geofenceId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
        {concentrationFlag && (
          <>
            <br />
            <div className={`nos-title${selected === 'concentration' ? ' selected' : ''}`}>
              Concentración de registros
              <br />
              <b>5 km x 5 km</b>
            </div>
            <div className="svgPointer">
              <GraphLoader
                message={messageConc}
                data={concentration}
                graphType="singleBullet"
                colors={matchColor('richnessGaps')}
                onClickGraphHandler={() => { this.setState({ selected: 'concentration' }); }}
                labelXLeft="Poco representado"
                labelXRight="Bien representado"
              />
            </div>
            <br />
            <div className="richnessLegend">
              <LegendColor
                orientation="column"
                color={matchColor('richnessGaps')('value')}
                key="value"
                marginLeft="2px"
                marginRight="6px"
              >
                {getLabelConcentration('value', areaId)}
              </LegendColor>
              {concentration.measures && Object.keys(concentration.measures).map((key) => (
                <LineLegend
                  orientation="column"
                  color={matchColor('richnessGaps')(key)}
                  key={key}
                >
                  {getLabelConcentration(key, areaId)}
                </LineLegend>

              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default SpeciesRecordsGaps;

SpeciesRecordsGaps.contextType = SearchContext;
