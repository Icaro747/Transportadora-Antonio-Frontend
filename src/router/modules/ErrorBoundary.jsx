import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";

function ErrorBoundary({ children }) {
  const [Error, setError] = useState(null);

  useEffect(() => {
    const handleErrors = (error, errorInfo) => {
      // Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error, errorInfo);
      setError(error);
    };

    // Adiciona um ouvinte global de erro
    window.addEventListener("error", handleErrors);

    return () => {
      // Remove o ouvinte quando o componente é desmontado
      window.removeEventListener("error", handleErrors);
    };
  }, []);

  if (Error) {
    // Extraindo informações específicas do erro para uma mensagem dinâmica
    let errorMessage = "";

    if (Error.message) {
      errorMessage = `Erro: ${Error.message}`;
    }

    // Você pode renderizar uma mensagem de erro personalizada aqui
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="container">
          <div className="alert alert-danger text-center py-3" role="alert">
            <b>
              <i className="bi bi-exclamation-triangle-fill mr-2" /> Houve um
              erro crítico! Por favor, entre em contato com o suporte.
            </b>
            {errorMessage !== "" && (
              <>
                <br />
                {errorMessage}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired
};

export default ErrorBoundary;
