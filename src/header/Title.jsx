import React from 'react';

class Title extends React.Component{
  render(){
    return(
      // <div className="interna">
        <h3><b>{this.props.title}</b></h3>
        // <h5>{this.props.subTitle}</h5>
      // </div>
    )
  }
}

export default Title;
