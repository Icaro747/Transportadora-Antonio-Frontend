import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

import Layout from "components/Layout";

import Home from "pages/Home";
import ListaFucionario from "pages/ListaFucionario";

function MainRouter() {
  const routeConfig = createBrowserRouter([
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
          path: "fucionario",
          children: [
            {
              index: true,
              element: (
                <Layout NomePaginaAtual="Lista Fucionarios">
                  <ListaFucionario />
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
