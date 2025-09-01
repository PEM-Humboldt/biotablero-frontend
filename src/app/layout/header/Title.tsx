import { Link } from "react-router-dom";

interface TitleProps {
  title: string;
  subTitle: string;
}

export function Title({ title, subTitle }: TitleProps) {
  return (
    <div className={subTitle ? "interna" : "cabezoteRight"}>
      <p>
        <Link to="/">
          <b>{title}</b>
        </Link>
      </p>
      {subTitle && <span>{subTitle}</span>}
    </div>
  );
}
