import React from "react";
import { Link } from "react-router-dom";

function Error401() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 className="display-4">401 - Não Autorizado</h1>
          <p className="lead">
            Você não tem permissão para acessar esta página.
          </p>
          <p>
            Entre em contato com o administrador do sistema para obter
            assistência.
          </p>
          <Link to="/" className="btn btn-primary mt-3">
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Error401;
