import React, { useState, useEffect } from "react";

import { format } from "date-fns";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";

import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";

function ListaFucionario() {
  const { setLoading } = useLoading();
  const Requicicao = new Api();
  const notify = useNotification();

  const [Lista, setLista] = useState([]);

  const [ShowModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [Data, setData] = useState({
    id: "",
    nome: "",
    apelido: ""
  });

  const LimparDataUser = () => {
    setData({
      id: "",
      nome: "",
      apelido: ""
    });
  };

  const StateDataPage = async () => {
    try {
      setLoading(true);
      const resposta = await Requicicao.Get({
        endpoint: "/Funcionario"
      });
      setLista(resposta);
    } catch (error) {
      notify({
        type: "erro",
        message: "Erro ao buscar funcionarios"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...Data, [name]: value });
  };

  const AtulizarFuncionario = async () => {
    try {
      setLoading(true);
      await Requicicao.Put({
        endpoint: "/Funcionario",
        data: Data
      });

      notify({
        type: "success",
        message: "Funcionario atualizado."
      });
      setShowModal(false);
      StateDataPage();
    } catch (error) {
      notify({
        type: "error",
        message: "Erro ao atualizar o funcionario"
      });
    } finally {
      setLoading(false);
    }
  };

  const CriarFuncionario = async () => {
    try {
      setLoading(true);
      await Requicicao.Post({
        endpoint: "/Funcionario",
        data: { nome: Data.nome, apelido: Data.apelido }
      });
      notify({
        type: "success",
        message: "Funcionario cadastrado."
      });
      setShowModal(false);
      StateDataPage();
    } catch (error) {
      notify({
        type: "error",
        message: "Erro ao cadastrar o funcionario"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Data.id !== "") AtulizarFuncionario();
    else CriarFuncionario();
  };

  const handleEditClick = (rowData) => {
    const data = {
      id: rowData.id,
      nome: rowData.nome,
      apelido: rowData.apelido
    };
    setData(data);
  };

  const onGlobalFilterChange = (e) => {
    try {
      const { value } = e.target;
      const thisFilters = { ...filters };

      thisFilters.global.value = value;

      setFilters(thisFilters);
      setGlobalFilterValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nome: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      plano: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const Desativars = async (rowData) => {
    try {
      setLoading(true);
      await Requicicao.Delete({
        endpoint: "/ClientePdv",
        params: { id: rowData.id }
      });
      notify({
        type: "success",
        message: "Cliente desativado."
      });
      StateDataPage();
    } catch (error) {
      notify({
        type: "error",
        message: "Erro ao desativado o cliente."
      });
    } finally {
      setLoading(false);
    }
  };

  const Confirm = (event, rowData) => {
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Tem certeza que o desejo deletar nesse item?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept: () => {
        Desativars(rowData);
      },
      reject: () => {},
      acceptLabel: "Sim",
      rejectLabel: "Não"
    });
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
        visible={ShowModal}
        position="right"
        onHide={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} className="card-body">
          <div className="row">
            <div className="col-12">
              <h5 className="mb-4">
                {Data.id !== "" ? "Editar Usuario" : "Novo Usuario"}
              </h5>
            </div>
            <div className="col-12">
              <label htmlFor="nome" className="form-label">
                Nome
              </label>
              <InputText
                id="nome"
                name="nome"
                value={Data.nome}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label htmlFor="apelido" className="form-label">
                Apelido
              </label>
              <InputText
                id="apelido"
                name="apelido"
                value={Data.apelido}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-12 mt-3">
              <div className="w-100 d-flex flex-row-reverse">
                <Button
                  type="submit"
                  label={Data.id !== "" ? "Atualizar" : "Salvar"}
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
            label="Lipra fitro"
            outlined
            onClick={clearFilter}
          />
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
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
          emptyMessage="Nenhum cliente encontrado."
          globalFilterFields={["nome", "plano"]}
          filters={filters}
        >
          <Column field="nome" header="Nome" sortable />
          <Column field="apelido" header="Apelido" sortable />
          <Column
            field="criadoEm"
            header="Data Criação"
            sortable
            body={(rowData) =>
              format(
                new Date(rowData.criadoEm).setHours(
                  new Date(rowData.criadoEm).getHours() - 2
                ),
                "dd/MM/yyyy hh:mm"
              )
            }
          />
          <Column
            header="Ações"
            body={(rowData) => (
              <div>
                <ConfirmPopup />
                <div className="d-flex flex-row gap-3">
                  <Button
                    className="btn btn-tabela"
                    type="button"
                    icon="bi bi-pencil"
                    onClick={() => {
                      handleEditClick(rowData);
                      setShowModal(true);
                    }}
                  />
                  <Button
                    className="btn btn-tabela"
                    type="button"
                    icon="bi bi-trash"
                    onClick={(event) => {
                      Confirm(event, rowData);
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

export default ListaFucionario;
