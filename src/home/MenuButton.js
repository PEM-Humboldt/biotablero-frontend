import React from 'react';
import { Link } from 'react-router-dom';

class MenuButton extends React.Component{
//adevia
  render(){
    return(
    <Link to={this.props.localLink}> {/* Props obligatorio */}
      <button className={this.props.styles}
        onClick={() => console.log("Prueba")}>
        {this.props.value} <b>{this.props.valueB}</b>
      </button>
    </Link>
    )
  }
}

export default MenuButton;
