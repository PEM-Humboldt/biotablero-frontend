import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import SearchContext from '../../SearchContext';
import ShortInfo from '../../commons/ShortInfo';
import { IconTooltip } from '../../commons/tooltips';

class ForestIntegrity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
    };
  }

  componentDidMount() {
    /* TODO: Call RestAPI function to load data (mock or real) */
  }

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const { showInfoGraph } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Acerca de esta sección">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {(
          showInfoGraph && (
          <ShortInfo
            name="Integridad"
            description="Integridad"
            className="graphinfo2"
            collapseButton={false}
          />
          )
        )}
        <div>
          {/* TODO: Call GraphLoader when the graph component is created */}
        </div>
      </div>
    );
  }
}

export default ForestIntegrity;

ForestIntegrity.contextType = SearchContext;
