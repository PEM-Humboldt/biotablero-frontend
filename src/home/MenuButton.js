import React from 'react';

class MenuButton extends React.Component{

  render(){
    return(
      <button className={this.props.styles} onMouseOver={console.log("Prueba")}>
        {this.props.value} <b>{this.props.valueB}</b>
      </button>
    )
  }
}

export default MenuButton;
