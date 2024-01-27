import React, { useLocation, useParams, Link } from "react-router-dom";

import PropTypes from "prop-types";

import ListaReplace from "./ListaReplaceBreadCrumb";

import "./styled.css";

function BreadCrumb({ NomePaginaAtual }) {
  const Location = useLocation();
  const Params = useParams();

  const { pathname } = Location;

  const SubstituirTextoURl = (originalUrl, dynamicUrl, useEncodeUrl) => {
    const namesDynamicUrl = Object.getOwnPropertyNames(dynamicUrl);
    let newOriginalUrl = originalUrl;

    namesDynamicUrl.forEach((item) => {
      if (useEncodeUrl) {
        newOriginalUrl = newOriginalUrl.replace(
          `[${item}]`,
          encodeURIComponent(dynamicUrl[item])
        );
      } else {
        newOriginalUrl = newOriginalUrl.replace(`[${item}]`, dynamicUrl[item]);
      }
    });

    return newOriginalUrl;
  };

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs = pathSegments.map((segment, index) => {
    const To = `/${pathSegments.slice(0, index + 1).join("/")}`;

    return {
      label: SubstituirTextoURl(segment, Params, false),
      path: To
    };
  });

  const ReplaceRota = (nome) => {
    if (ListaReplace.length > 0) {
      const thisOjb = ListaReplace.filter((e) => e.name === nome);
      return thisOjb.length > 0 ? thisOjb[0].replace : nome;
    }
    return nome;
  };

  return (
    <div className="bread-crumb-box">
      <div className="bread-crumb">
        <h1>{NomePaginaAtual}</h1>
        <ol>
          {breadcrumbs.map((item) => (
            <li key={`${item.path}-${item.label}`}>
              <Link to={item.path}>{ReplaceRota(item.label)}</Link>
            </li>
          ))}
        </ol>
      </div>
      <hr />
    </div>
  );
}

BreadCrumb.propTypes = {
  NomePaginaAtual: PropTypes.string.isRequired
};

export default BreadCrumb;
