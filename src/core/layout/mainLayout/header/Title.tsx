import { Link } from "react-router";

interface TitleProps {
  title: string;
}

export function Title({ title }: TitleProps) {
  return (
    <p>
      <Link to="/">
        <b>{title}</b>
      </Link>
    </p>
  );
}
