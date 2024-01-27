import React, { useState } from "react";

import PropTypes from "prop-types";

import { LoadingProvider } from "context/LoadingContext";
import { NotificationProvider } from "context/NotificationContext";

import BreadCrumb from "../BreadCrumb";
import Header from "../Header";
import Sidebar from "../Sidebar";

function Layout({ children, NomePaginaAtual }) {
  const [ShowMenu, setShowMenu] = useState(false);

  return (
    <NotificationProvider>
      <Header />
      <div className="layout-content">
        <div className="main-container">
          <Sidebar Show={ShowMenu} setShow={setShowMenu} />
          <div
            className="main-box"
            style={ShowMenu ? { marginLeft: "229px" } : {}}
          >
            <main className="content">
              <LoadingProvider>
                <>
                  <BreadCrumb NomePaginaAtual={NomePaginaAtual} />
                  {children}
                </>
              </LoadingProvider>
            </main>
            <footer>
              <hr />
              <p>Akkadian Tech 2023</p>
            </footer>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.element,
  NomePaginaAtual: PropTypes.string.isRequired
};

Layout.defaultProps = {
  children: <div />
};

export default Layout;
