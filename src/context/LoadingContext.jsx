import React, { createContext, useContext, useState, useMemo } from "react";

import PropTypes from "prop-types";

import { ProgressSpinner } from "primereact/progressspinner";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const Values = useMemo(
    () => ({
      isloading: loading,
      setLoading
    }),
    [loading]
  );

  return (
    <LoadingContext.Provider value={Values}>
      {children}
      {loading && (
        <>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100vh",
              backgroundColor: "rgb(238 238 238 / 50%)"
            }}
          />
          <ProgressSpinner
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
            strokeWidth="3"
            fill="#eee"
            animationDuration="3s"
          />
        </>
      )}
    </LoadingContext.Provider>
  );
}

LoadingProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error(
      "useLoading deve ser utilizado dentro de um LoadingProvider"
    );
  }
  return context;
};
