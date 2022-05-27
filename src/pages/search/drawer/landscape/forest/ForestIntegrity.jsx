import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import GraphLoader from 'components/charts/GraphLoader';
import { LegendColor, BorderLegendColor } from 'components/CssLegends';
import DownloadCSV from 'components/DownloadCSV';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import { SCIHFTexts } from 'pages/search/drawer/landscape/forest/InfoTexts';
import SearchContext from 'pages/search/SearchContext';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import TextBoxes from 'components/TextBoxes';

const {
  info,
  meto,
  cons,
  quote,
} = SCIHFTexts;
class ForestIntegrity extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      SciHfCats: {
        'alta-estable_natural': {
          id: 'alta-estable_natural',
          label: 'ICE Alto - IHEH Natural',
          value: 0,
        },
        'alta-dinamica': {
          id: 'alta-dinamica',
          label: 'ICE Alto - IHEH Dinámica',
          value: 0,
        },
        'alta-estable_alta': {
          id: 'alta-estable_alta',
          label: 'ICE Alto - IHEH Alta',
          value: 0,
        },
        'baja_moderada-estable_natural': {
          id: 'baja_moderada-estable_natural',
          label: 'ICE Bajo Moderado - IHEH Natural',
          value: 0,
        },
        'baja_moderada-dinamica': {
          id: 'baja_moderada-dinamica',
          label: 'ICE Bajo Moderado - IHEH Dinámica',
          value: 0,
        },
        'baja_moderada-estable_alta': {
          id: 'baja_moderada-estable_alta',
          label: 'ICE Bajo Moderado - IHEH Alta',
          value: 0,
        },
      },
      ProtectedAreas: {
        'alta-estable_alta': [],
        'alta-dinamica': [],
        'alta-estable_natural': [],
        'baja_moderada-estable_alta': [],
        'baja_moderada-dinamica': [],
        'baja_moderada-estable_natural': [],
      },
      selectedCategory: null,
      loading: 'loading',
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    switchLayer('forestIntegrity');

    RestAPI.requestSCIHF(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          if (res.length <= 0) {
            this.setState({ SciHfCats: {}, ProtectedAreas: {}, loading: 'no-data' });
          } else {
            this.setState((prevState) => {
              const { SciHfCats: cats, ProtectedAreas: PAs } = prevState;
              res.forEach((elem) => {
                const idx = `${elem.sci_cat}-${elem.hf_pers}`;
                cats[idx].value += elem.area;
                if (elem.pa === 'No Protegida') {
                  PAs[idx].push({ key: elem.pa, label: elem.pa, area: elem.area });
                } else {
                  PAs[idx].unshift({ key: elem.pa, label: elem.pa, area: elem.area });
                }
              });
              Object.keys(PAs).forEach(((sciHfCat) => {
                PAs[sciHfCat] = PAs[sciHfCat].map((areas) => ({
                  ...areas,
                  percentage: areas.area / cats[sciHfCat].value,
                }));
              }));
              return { SciHfCats: cats, ProtectedAreas: PAs, loading: null };
            });
          }
        }
      })
      .catch(() => {
        this.setState({ loading: 'no-data' });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const {
      showInfoGraph,
      SciHfCats,
      ProtectedAreas,
      selectedCategory,
      loading,
    } = this.state;
    const {
      areaId,
      geofenceId,
      handlerClickOnGraph,
    } = this.context;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`graphinfo${showInfoGraph ? ' activeBox' : ''}`}
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <h3 className="inlineb">Haz clic en la gráfica para visualizar las áreas protegidas</h3>
        <BorderLegendColor color={matchColor('border')()}>
          Límite de áreas protegidas
        </BorderLegendColor>
        <div>
          <GraphLoader
            message={loading}
            data={Object.values(SciHfCats)}
            graphType="pie"
            units="ha"
            colors={matchColor('SciHf')}
            onClickGraphHandler={(sectionId) => {
              this.setState({ selectedCategory: sectionId });
              handlerClickOnGraph({ chartType: 'SciHf', selectedKey: sectionId });
            }}
          />
          <div className="fiLegend">
            {Object.keys(SciHfCats).map((cat) => (
              <LegendColor
                color={matchColor('SciHf')(cat)}
                orientation="column"
                key={cat}
              >
                {SciHfCats[cat].label}
              </LegendColor>
            ))}
          </div>
        </div>
        <TextBoxes
          consText={cons}
          metoText={meto}
          quoteText={quote}
          downloadData={Object.values(SciHfCats)}
          downloadName={`forest_integrity_${areaId}_${geofenceId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
        {selectedCategory && (
          <>
            <h6>
              Distribución en áreas protegidas
            </h6>
            <DownloadCSV
              data={Object.values(ProtectedAreas[selectedCategory])}
              filename={`bt_fi_areas_${selectedCategory}_${areaId}_${geofenceId}.csv`}
            />
            <div style={{ padding: '0 12px' }}>
              <GraphLoader
                data={ProtectedAreas[selectedCategory]}
                graphType="SmallBarStackGraph"
                units="ha"
                colors={matchColor('pa', true)}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default ForestIntegrity;

ForestIntegrity.contextType = SearchContext;
