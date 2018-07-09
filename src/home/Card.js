import React from 'react';

class Card extends React.Component {

  render(){
    return(
      <div className={this.props.styles} >
        <h1>{this.props.title}</h1>
        <p>{this.props.content}</p>
      </div>
    );
  }
}

export default Card;
