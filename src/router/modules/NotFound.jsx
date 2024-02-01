import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h2>404 - Página não encontrada</h2>
      <Link to="/">Voltar para a Página Inicial</Link>
    </div>
  );
}

export default NotFound;
