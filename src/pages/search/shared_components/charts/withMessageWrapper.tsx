import React from "react";

import { wrapperMessage } from "pages/search/types/charts";

interface MessageProps {
  message: wrapperMessage;
  customMessage?: string;
}

const withMessageWrapper = <T,>(
  WrappedChart: React.ComponentType<
    Omit<T & MessageProps, "message" | "customMessage">
  >
) => {
  const WithMessageWrapper: React.FC<T & MessageProps> = (props) => {
    const { message, customMessage, ...otherProps } = props;
    let errorMessage = null;
    if (message === "loading") {
      errorMessage = "Cargando información...";
    } else if (message === "no-data") {
      errorMessage = "Información no disponible";
    } else if (message === "custom") {
      errorMessage = customMessage;
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
