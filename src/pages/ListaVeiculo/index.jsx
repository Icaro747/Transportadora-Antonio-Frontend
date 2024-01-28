import React, { useState, useEffect } from "react";

import { format } from "date-fns";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Sidebar } from "primereact/sidebar";

import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";

function ListaVeiculo() {
  const { setLoading } = useLoading();
  const Requicicao = new Api();
  const Notify = useNotification();

  const [lista, setLista] = useState([]);

  const [showModalFormVeviculo, setShowModalFormVeviculo] = useState(false);

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [listaFuncionario, setListaFuncionario] = useState([]);
  const [selectedFuncionarios, setSelectedFuncionarios] = useState(null);
  const [data, setData] = useState({
    id: "",
    nome: "",
    descricao: "",
    placa: "",
    funcionarios: []
  });

  const LimparDataUser = () => {
    setData({
      id: "",
      nome: "",
      descricao: "",
      placa: "",
      funcionarios: []
    });
  };

  const StateDataPage = async () => {
    try {
      setLoading(true);
      const listaVeiculos = await Requicicao.Get({
        endpoint: "/Veiculo"
      });
      setLista(listaVeiculos);

      const listaFuncionarios = await Requicicao.Get({
        endpoint: "/Funcionario"
      });
      setListaFuncionario(
        listaFuncionarios.map((item) => ({ code: item.id, name: item.nome }))
      );
    } catch (error) {
      Notify({
        type: "erro",
        message: "Erro ao buscar veiculo"
      });
    } finally {
      setLoading(false);
    }
  };

  const HandleChange = (event) => {
    const { name, value } = event.target;
    if (name === "funcionarios")
      setData({ ...data, [name]: value.map((item) => item.code) });
    else setData({ ...data, [name]: value });
  };

  const AtulizarVeiculo = async () => {
    try {
      setLoading(true);
      await Requicicao.Put({
        endpoint: "/Veiculo",
        data
      });

      Notify({
        type: "success",
        message: "Veiculo atualizado."
      });
      setShowModalFormVeviculo(false);
      StateDataPage();
    } catch (error) {
      Notify({
        type: "erro",
        message: "Erro ao atualizar o veiculo"
      });
    } finally {
      setLoading(false);
    }
  };

  const CriarVeiculo = async () => {
    try {
      setLoading(true);
      await Requicicao.Post({
        endpoint: "/Veiculo",
        data: {
          nome: data.nome,
          descricao: data.descricao,
          placa: data.placa,
          funcionarios: data.funcionarios
        }
      });
      Notify({
        type: "success",
        message: "Veiculo cadastrado."
      });
      setShowModalFormVeviculo(false);
      StateDataPage();
    } catch (error) {
      Notify({
        type: "erro",
        message: "Erro ao cadastrar o veiculo"
      });
    } finally {
      setLoading(false);
    }
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
    if (data.id !== "") AtulizarVeiculo();
    else CriarVeiculo();
  };

  const HandleEditClick = (rowData) => {
    const esteItem = lista.filter((x) => x.id === rowData.id)[0];
    setSelectedFuncionarios(
      listaFuncionario.filter((x) => esteItem.funcionarios.includes(x.code))
    );
    setData(esteItem);
  };

  const OnGlobalFilterChange = (event) => {
    try {
      const { value } = event.target;
      const thisFilters = { ...filters };

      thisFilters.global.value = value;

      setFilters(thisFilters);
      setGlobalFilterValue(value);
    } catch (error) {
      Notify({
        type: "erro",
        message: "Erro de busca do item"
      });
    }
  };

  const InitFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nome: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      descricao: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      placa: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
    setGlobalFilterValue("");
  };

  const ClearFilter = () => {
    InitFilters();
  };

  useEffect(
    () => () => {
      StateDataPage();
      InitFilters();
    },
    []
  );

  return (
    <div>
      <div className="w-100 d-flex flex-row mb-3">
        <Button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowModalFormVeviculo(true);
            LimparDataUser();
          }}
        >
          Novo
        </Button>
      </div>
      <Sidebar
        style={{ minWidth: "350px" }}
        position="right"
        visible={showModalFormVeviculo}
        onHide={() => setShowModalFormVeviculo(false)}
      >
        <form onSubmit={HandleSubmit} className="card-body">
          <div className="row">
            <div className="col-12">
              <h5 className="mb-4">
                {data.id !== "" ? "Editar " : "Novo "}Veiculo
              </h5>
            </div>
            <div className="col-12 mb-3">
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

            <div className="col-12 mb-3">
              <label htmlFor="descricao" className="form-label">
                Descrição
              </label>
              <InputText
                id="descricao"
                name="descricao"
                value={data.descricao}
                onChange={HandleChange}
                className="form-control"
              />
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="placa" className="form-label">
                Placa
              </label>
              <InputMask
                id="placa"
                name="placa"
                value={data.placa}
                onChange={HandleChange}
                className="form-control"
                mask="aaa-9a99"
              />
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="funcionarios" className="form-label">
                Funcionarios
              </label>
              <MultiSelect
                id="funcionarios"
                value={selectedFuncionarios}
                onChange={(e) => {
                  HandleChange({
                    target: { name: "funcionarios", value: e.value }
                  });
                  setSelectedFuncionarios(e.value);
                }}
                options={listaFuncionario}
                optionLabel="name"
                placeholder="Selecione Funcionarios"
                className="w-100"
              />
            </div>

            <div className="col-md-12">
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
          value={lista}
          stripedRows
          paginator
          rows={5}
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage="Nenhum veiculo encontrado."
          globalFilterFields={["nome", "descricao", "placa"]}
          filters={filters}
        >
          <Column field="nome" header="Nome" sortable />
          <Column field="descricao" header="Descrição" sortable />
          <Column field="placa" header="Placa" sortable />
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
                      setShowModalFormVeviculo(true);
                    }}
                    tooltip="Editar item"
                    tooltipOptions={{ position: "bottom" }}
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

export default ListaVeiculo;
