import React from 'react';
import AccountCircle from '@material-ui/icons/AccountCircle';

/* Uim: User Interface Manager*/
class Uim extends React.Component {

  render(){
    return(
      <div className="userBox">
        <AccountCircle className="userBox"
          style={{fontSize: '40px'}}/>
      </div>
    )
  }
}

export default Uim;
