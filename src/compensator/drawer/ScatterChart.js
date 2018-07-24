import React, { PureComponent } from 'react';
import { ScatterplotChart, ToolTip } from 'react-easy-chart';

export default class ScatterplotContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.mouseOverHandler = this.mouseOverHandler.bind(this);
    this.mouseOutHandler = this.mouseOutHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.toggleState = this.toggleState.bind(this);
    this.turnOffRandomData = this.turnOffRandomData.bind(this);
    this.turnOnRandomData = this.turnOnRandomData.bind(this);

    this.state = {
      dataDisplay: '',
      showToolTip: false,
      randomDataIntervalId: null,
      windowWidth: 400,
      componentWidth: 500,
    };
    this.data = this.generateData();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

generateData() {
    const data = [];
    const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    keys.forEach((key) => {
      data.push({
        type: key,
        x: this.getRandomArbitrary(1, 1000),
        y: this.getRandomArbitrary(1, 1000)
      });
    });
    return data;
  }

  handleResize() {
    this.setState({
      windowWidth: this.props.width - 100,
      componentWidth: this.props.width
    });
    console.log('ScatterChart: '+JSON.stringify(this.state));
  }

  mouseOverHandler(d, e) {
    this.setState({
      showToolTip: true,
      top: `${e.screenY - 10}px`,
      left: `${e.screenX + 10}px`,
      y: d.y,
      x: d.x });
  }

  mouseMoveHandler(e) {
    if (this.state.showToolTip) {
      this.setState({ top: `${e.y - 10}px`, left: `${e.x + 10}px` });
    }
  }

  mouseOutHandler() {
    this.setState({ showToolTip: false });
  }

  clickHandler(d) {
    this.setState({ dataDisplay: `The amount selected is ${d.y}` });
  }

  turnOnRandomData() {
    this.setState({ randomDataIntervalId: setInterval(this.updateData.bind(this), 1000) });
  }

  turnOffRandomData() {
    clearInterval(this.state.randomDataIntervalId);
    this.setState({ randomDataIntervalId: null });
  }

  updateData() {
    this.data = this.generateData();
    this.forceUpdate();
  }

  toggleState() {
    this.setState({
      active: !this.state.active
    });
  }

  createTooltip() {
    if (this.state.showToolTip) {
      return (
        <ToolTip
          top={this.state.top}
          left={this.state.left}
        >
            The x value is {this.state.x} and the y value is {this.state.y}
        </ToolTip>
      );
    }
    return false;
  }

  render() {
    return (
      <ScatterplotChart
        data={this.data}
        grid
        axes={(this.state.componentWidth) > 400}
        axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
        margin={{ top: 10, right: 10, bottom: 30, left: 60 }}
        width={this.state.componentWidth}
        height={this.state.componentWidth / 2}
      />
    );
  }
}
