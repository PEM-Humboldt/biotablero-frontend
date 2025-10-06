import React, { useState } from "react";

interface ShortInfoTypes {
  className?: string;
  description: string;
  tooltip?: string;
  collapseButton?: boolean;
}

export function ShortInfo({
  description = "",
  tooltip = "",
  collapseButton = true,
  className = "hidden",
}: ShortInfoTypes) {
  const [rotate_button, setRotate_button] = useState(true);
  const [hide_text, setHide_text] = useState(true);

  const handleClick = () => {
    setRotate_button(!rotate_button);
    setHide_text(!hide_text);
  };

  return (
    <div>
      <div
        className={`${className}-${hide_text}`}
        dangerouslySetInnerHTML={{
          __html: `${description === "" ? "Cargando..." : description}`,
        }}
      />
      {collapseButton && (
        <button
          type="button"
          className={`showHome rotate-${hide_text}`}
          title={tooltip}
          aria-label={tooltip}
          onClick={handleClick}
        />
      )}
    </div>
  );
}
