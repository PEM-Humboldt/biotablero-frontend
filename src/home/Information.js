import React from 'react';
import Element from './InfoButton';
import Description from './Description';

class Information extends React.Component {
  render () {
    return(
      <div className="menuline">
			<menu id="listado">
        <Element styles={"btnhome active"} valueB="01" value=" ¿Qué es?"/>
				<Element styles={"btnhome"} valueB="02" value=" ¿Por qué?"/>
				<Element styles={"btnhome"} valueB="03" value=" ¿Quién produce?"/>
				<Element styles={"btnhome"} valueB="04" value=" ¿Qué encuentras?"/>
			</menu>
    <Description />
		</div>
  );
  }
}

export default Information;
