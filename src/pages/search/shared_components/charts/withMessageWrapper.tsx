import React from "react";

import { wrapperMessage } from "pages/search/types/charts";

interface MessageProps {
  message: wrapperMessage;
}

const withMessageWrapper = <T,>(
  WrappedChart: React.ComponentType<Omit<T & MessageProps, "message">>
) => {
  const WithMessageWrapper: React.FC<T & MessageProps> = (props) => {
    const { message, ...otherProps } = props;
    let errorMessage = null;
    if (message === "loading") {
      errorMessage = "Cargando información...";
    } else if (message === "no-data") {
      errorMessage = "Información no disponible";
    }
    if (errorMessage) {
      return <div className="errorData">{errorMessage}</div>;
    }
    return <WrappedChart {...otherProps} />;
  };
  WithMessageWrapper.displayName = `WithMessageWrapper(${
    WrappedChart.displayName || WrappedChart.name || "Chart"
  })`;
  return WithMessageWrapper;
};

export default withMessageWrapper;
