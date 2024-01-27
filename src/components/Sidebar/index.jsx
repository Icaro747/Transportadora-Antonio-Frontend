import React, { useState } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import "./styled.css";

function Sidebar({ Show, setShow }) {
  const items = [
    {
      label: "Cadastros",
      icon: "pi pi-file-edit",
      children: [
        { label: "Empresas", icon: "pi pi-building", to: "/app/empresa" },
        { label: "Produto", icon: "pi pi-mobile", to: "/app/produto" },
        {
          label: "Grupo de Produto",
          icon: "pi pi-tags",
          to: "/app/grupo"
        },
        {
          label: "Ponto de Venda",
          icon: "pi pi-shopping-cart",
          to: "/app/pontoVenda"
        },
        { label: "Fucionario", icon: "pi pi-user", to: "/app/fucionario" }
      ]
    }
  ];

  const [ListaSubitem, setListaSubitem] = useState([]);
  const [ItemSelect, setItemSelect] = useState("");

  return (
    <nav className="layout-sidebar">
      <div className="layout-box-menus">
        <ul className="layout-menu">
          {items.map((item) => (
            <li key={item.label} className="layout-menu-item">
              <button
                type="button"
                className="button-none"
                onClick={() => {
                  if (ItemSelect === item.label) {
                    setShow(false);
                    if (Show === false) setShow(true);
                  } else {
                    setShow(true);
                    setListaSubitem(item.children);
                  }
                  setItemSelect(item.label);
                }}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="layout-box-menus"
        style={
          !Show
            ? { transform: "translateX(-130px)" }
            : { transform: "translateX(100px)" }
        }
      >
        <ul className="sub-menu">
          {ListaSubitem.map((item) => (
            <li key={item.label} className="layout-menu-item">
              <Link to={item.to}>
                <i className={item.icon} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

Sidebar.propTypes = {
  Show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default Sidebar;
