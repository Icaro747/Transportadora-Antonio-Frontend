import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

import Layout from "components/Layout";

import Home from "pages/Home";
import ListaCategoria from "pages/ListaCategoria";
import ListaEventoVeiculo from "pages/ListaEventoVeiculo";
import ListaFucionario from "pages/ListaFucionario";
import ListaVeiculo from "pages/ListaVeiculo";
import VisaoGeral from "pages/VisaoGeral";

function MainRouter() {
  const routeConfig = createBrowserRouter([
    { path: "*", element: <Navigate to="/app" /> },
    { path: "/", element: <Navigate to="/app" /> },
    {
      path: "/app",
      children: [
        {
          index: true,
          element: (
            <Layout NomePaginaAtual="Home">
              <Home />
            </Layout>
          )
        },
        {
          path: "cadastros",
          children: [
            {
              path: "fucionario",
              element: (
                <Layout NomePaginaAtual="Lista Fucionarios">
                  <ListaFucionario />
                </Layout>
              )
            },
            {
              path: "veiculo",
              element: (
                <Layout NomePaginaAtual="Lista Veiculo">
                  <ListaVeiculo />
                </Layout>
              )
            },
            {
              path: "eventoveiculo",
              element: (
                <Layout NomePaginaAtual="Lista Eventos dos Veiculos">
                  <ListaEventoVeiculo />
                </Layout>
              )
            },
            {
              path: "categoria",
              element: (
                <Layout NomePaginaAtual="Lista Categorias">
                  <ListaCategoria />
                </Layout>
              )
            }
          ]
        },
        {
          path: "graficos",
          children: [
            {
              path: "visaogeral",
              element: (
                <Layout NomePaginaAtual="Visão Geral">
                  <VisaoGeral />
                </Layout>
              )
            }
          ]
        }
      ]
    }
  ]);

  return <RouterProvider router={routeConfig} />;
}

export default MainRouter;
