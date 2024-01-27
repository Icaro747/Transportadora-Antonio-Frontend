import React from "react";

import MainRouter from "router";
import ErrorBoundary from "router/modules/ErrorBoundary";

import "styles/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "styles/Restyling.scss";
import "styles/App.css";

function App() {
  return (
    <ErrorBoundary>
      <MainRouter />
    </ErrorBoundary>
  );
}

export default App;
