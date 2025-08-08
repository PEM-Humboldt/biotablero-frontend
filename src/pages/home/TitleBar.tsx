import React from "react";

type TitleBarProps = {
  title: string | React.ReactNode;
  alignClass: string;
};

export const TitleBar = ({ title, alignClass }: TitleBarProps) => {
  return (
    <div className="Cenefa">
      <h1 className={` ${alignClass}`}>{title}</h1>
    </div>
  );
};
