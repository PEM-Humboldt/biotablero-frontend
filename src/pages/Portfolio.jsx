import Item from 'pages/portfolio/Item';
import React from 'react';

const Portfolio = () => (
  <div className="wrapperPort">
    <div className="splitPort">
      <div className="colPort1">
        <h1 className="portTitle">
          Portafolios
        </h1>
        <div className="portText1">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
            sed diam nonummy nibh euismod tincidunt ut laoreet dolore
            magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
            quis nostrud exerci tation ullamcorper suscipit lobortis
            nisl ut aliquip ex ea commodo consequat. Duis autem vel eum
            iriure dolor in hendrerit in vulputate velit esse molestie
            consequat, vel illum dolore eu feugiat nulla.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
            sed diam nonummy nibh euismod tincidunt ut laoreet dolore
            magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
            quis nostrud exerci tation ullamcorper suscipit lobortis
            nisl ut aliquip ex ea commodo consequat. Duis autem vel eum
            iriure dolor in hendrerit in vulputate velit esse molestie
            consequat, vel illum dolore eu feugiat nulla.
          </p>
        </div>
      </div>
      <div className="colPort2">
        <div className="rowPort1">
          <Item
            title="NATURE MAP · WCMC"
            year="2021"
            description={`Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
              sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat. Ut wisi enim ad minim veniam,
              quis nostrud exerci tation ullamcorper suscipit
              lobortis nisl ut aliquip ex ea commodo consequat.`}
            link="http://portafolios.humboldt.org.co"
          />
        </div>
        <div className="rowPort2">
          <Item
            title="ELSA · PNUD"
            year="2020"
            description={`Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
              sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat. Ut wisi enim ad minim veniam,
              quis nostrud exerci tation ullamcorper suscipit
              lobortis nisl ut aliquip ex ea commodo consequat.`}
            link="http://humboldt.org.co/es/"
          />
        </div>
        <div className="rowPort3">
          <Item
            title="WEPLAN FOREST"
            year="2021"
            description={`Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
              sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat. Ut wisi enim ad minim veniam,
              quis nostrud exerci tation ullamcorper suscipit
              lobortis nisl ut aliquip ex ea commodo consequat.`}
            link="http://humboldt.org.co/es/"
          />
        </div>
      </div>
    </div>
  </div>
);

export default Portfolio;
