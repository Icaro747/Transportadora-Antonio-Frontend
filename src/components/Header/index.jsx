import React from "react";

import Logo from "assets/img/logo/black-full.63543a82.png";
import "./styled.css";

function Header() {
  return (
    <header className="header-container">
      <div className="header-box">
        <div className="header-item-center">
          <img src={Logo} alt="Logo da Empresa" style={{ height: "40px" }} />
        </div>
      </div>
    </header>
  );
}

export default Header;
