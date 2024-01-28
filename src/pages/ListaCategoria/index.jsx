import React, { useState, useEffect } from "react";

import { format } from "date-fns";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";

import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";

function ListaCategoria() {
  const { setLoading } = useLoading();
  const Requicicao = new Api();
  const Notify = useNotification();

  const [Lista, setLista] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [data, setData] = useState({
    id: "",
    nome: ""
  });

  const LimparDataUser = () => {
    setData({
      id: "",
      nome: ""
    });
  };

  const StateDataPage = async () => {
    try {
      setLoading(true);
      const resposta = await Requicicao.Get({
        endpoint: "/Categoria"
      });
      setLista(resposta);
    } catch (error) {
      Notify({
        type: "erro",
        message: "Erro ao buscar Categoria"
      });
    } finally {
      setLoading(false);
    }
  };

  const HandleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const AtulizarCategoira = async () => {
    try {
      setLoading(true);
      await Requicicao.Put({
        endpoint: "/Categoria",
        data
      });

      Notify({
        type: "success",
        message: "Categoria atualizado."
      });
      setShowModal(false);
      StateDataPage();
    } catch (error) {
      Notify({
        type: "error",
        message: "Erro ao atualizar o categoria"
      });
    } finally {
      setLoading(false);
    }
  };

  const CriarCategoria = async () => {
    try {
      setLoading(true);
      await Requicicao.Post({
        endpoint: "/Categoria",
        data: { nome: data.nome, apelido: data.apelido }
      });
      Notify({
        type: "success",
        message: "Categoria cadastrado."
      });
      setShowModal(false);
      StateDataPage();
    } catch (error) {
      Notify({
        type: "error",
        message: "Erro ao cadastrar o categoria"
      });
    } finally {
      setLoading(false);
    }
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
    if (data.id !== "") AtulizarCategoira();
    else CriarCategoria();
  };

  const HandleEditClick = (rowData) => {
    const newData = {
      id: rowData.id,
      nome: rowData.nome
    };
    setData(newData);
  };

  const OnGlobalFilterChange = (e) => {
    try {
      const { value } = e.target;
      const thisFilters = { ...filters };

      thisFilters.global.value = value;

      setFilters(thisFilters);
      setGlobalFilterValue(value);
    } catch (error) {
      Notify({
        type: "error",
        message: "Erro no Filtro"
      });
    }
  };

  const InitFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nome: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
    setGlobalFilterValue("");
  };

  const ClearFilter = () => {
    InitFilters();
  };

  useEffect(() => () => StateDataPage(), []);

  return (
    <div>
      <div className="w-100 d-flex flex-row mb-3">
        <Button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowModal(true);
            LimparDataUser();
          }}
        >
          Novo
        </Button>
      </div>
      <Sidebar
        style={{ minWidth: "350px" }}
        position="right"
        visible={showModal}
        onHide={() => setShowModal(false)}
      >
        <form onSubmit={HandleSubmit} className="card-body">
          <div className="row">
            <div className="col-12">
              <h5 className="mb-4">
                {data.id !== "" ? "Editar " : "Nova "}Categoria
              </h5>
            </div>
            <div className="col-12">
              <label htmlFor="nome" className="form-label">
                Nome
              </label>
              <InputText
                id="nome"
                name="nome"
                value={data.nome}
                onChange={HandleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-12 mt-3">
              <div className="w-100 d-flex flex-row-reverse">
                <Button
                  type="submit"
                  label={data.id !== "" ? "Atualizar" : "Salvar"}
                  className="btn btn-primary"
                />
              </div>
            </div>
          </div>
        </form>
      </Sidebar>
      <div className="card p-3">
        <div className="d-flex justify-content-between mb-3">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Limpar Filtros"
            outlined
            onClick={ClearFilter}
          />
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={OnGlobalFilterChange}
              placeholder="Pesquisa Global"
            />
          </span>
        </div>
        <DataTable
          value={Lista}
          stripedRows
          paginator
          rows={5}
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage="Nenhum categoria encontrado."
          globalFilterFields={["nome"]}
          filters={filters}
        >
          <Column field="nome" header="Nome" sortable />
          <Column
            field="criadoEm"
            header="Data Criação"
            sortable
            body={(rowData) =>
              format(
                new Date(rowData.criadoEm).setHours(
                  new Date(rowData.criadoEm).getHours() - 3
                ),
                "dd/MM/yyyy hh:mm"
              )
            }
          />
          <Column
            field="modificadoEm"
            header="Última Atualização"
            sortable
            body={(rowData) =>
              rowData.modificadoEm
                ? format(
                    new Date(rowData.modificadoEm).setHours(
                      new Date(rowData.modificadoEm).getHours() - 3
                    ),
                    "dd/MM/yyyy hh:mm"
                  )
                : ""
            }
          />
          <Column
            header="Ações"
            body={(rowData) => (
              <div>
                <div className="d-flex flex-row gap-3">
                  <Button
                    className="btn btn-tabela"
                    type="button"
                    icon="bi bi-pencil"
                    onClick={() => {
                      HandleEditClick(rowData);
                      setShowModal(true);
                    }}
                  />
                </div>
              </div>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
}

export default ListaCategoria;
