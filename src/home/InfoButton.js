// TODO: averiguar que hace

import React from 'react';

class InfoButton extends React.Component{
  
  render(){
    return(
      <button className={this.props.styles} >
        <b>{this.props.valueB}</b> {this.props.value}
      </button>
    )
  }
}

export default InfoButton;
