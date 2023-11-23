import React, { useState } from "react";
import isUndefinedOrNull from "utils/validations";

interface ShortInfoTypes {
  className?: string;
  description?: string;
  tooltip?: string;
  collapseButton?: boolean;
}

const ShortInfo: React.FC<ShortInfoTypes> = ({
  description = "",
  tooltip = "",
  collapseButton = true,
  className = "hidden",
}) => {
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
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `${
            isUndefinedOrNull(description) ? "Cargando..." : description
          }`,
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
};

export default ShortInfo;
