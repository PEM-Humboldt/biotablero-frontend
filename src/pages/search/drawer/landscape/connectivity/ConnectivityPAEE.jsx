import React from 'react';

import SearchContext from 'pages/search/SearchContext';

class ConnectivityPAEE extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
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
    return (
      <div className="graphcontainer pt6">
        <div />
      </div>
    );
  }
}

export default ConnectivityPAEE;

ConnectivityPAEE.contextType = SearchContext;
