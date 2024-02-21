import React from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  subTitle: string;
}

const Title: React.FunctionComponent<Props> = ({ title, subTitle }) => (
  <div className={subTitle ? "interna" : "cabezoteRight"}>
    <h3>
      <Link to="/">
        <b>{title}</b>
      </Link>
    </h3>
    {subTitle && <h5>{subTitle}</h5>}
  </div>
);

export default Title;
