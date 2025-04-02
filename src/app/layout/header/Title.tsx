import React from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  subTitle: string;
}

const Title: React.FunctionComponent<Props> = ({ title, subTitle }) => (
  <div className={subTitle ? "interna" : "cabezoteRight"}>
    <p>
      <Link to="/">
        <b>{title}</b>
      </Link>
    </p>
    {subTitle && <h5>{subTitle}</h5>}
  </div>
);

export default Title;
