import React, { useState, useEffect } from "react";

import { format } from "date-fns";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";

import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import MaskUtil from "utils/MaskUtil";

function ListaEventoVeiculo() {
  const { setLoading } = useLoading();
  const Requicicao = new Api();
  const Notify = useNotification();

  const [lista, setLista] = useState([]);

  const [showModalFormVeviculo, setShowModalFormVeviculo] = useState(false);

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [listaCategoria, setListaCategoria] = useState([]);
  const [selectedVeiculo, setSelectedVeiculo] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const [dataDataCalendar, setDataDataCalendar] = useState(null);

  const [data, setData] = useState({
    id: "",
    data: "",
    descricao: "",
    valor: null,
    isDespesa: false,
    veiculoId: "",
    categoriaId: ""
  });

  const LimparData = () => {
    setData({
      id: "",
      data: "",
      descricao: "",
      valor: null,
      isDespesa: false,
      veiculoId: "",
      categoriaId: ""
    });
    setSelectedVeiculo(null);
    setSelectedCategoria(null);
    setDataDataCalendar(null);
  };

  const StateDataPage = async () => {
    try {
      setLoading(true);
      const listaEventos = await Requicicao.Get({
        endpoint: "/EventoVeiculo"
      });
      setLista(listaEventos);

      const novaListaVeiculos = await Requicicao.Get({
        endpoint: "/Veiculo"
      });
      setListaVeiculos(
        novaListaVeiculos.map((item) => ({
          code: item.id,
          name: `${item.placa} ${item.nome}`
        }))
      );

      const novaListaCategoria = await Requicicao.Get({
        endpoint: "/Categoria"
      });
      setListaCategoria(
        novaListaCategoria.map((item) => ({ code: item.id, name: item.nome }))
      );
    } catch (error) {
      Notify({
        type: "erro",
        message: "Erro ao buscar eventos dos Veiculos"
      });
    } finally {
      setLoading(false);
    }
  };

  const HandleChange = (event) => {
    const { name, value } = event.target;
    if (name === "data") {
      const valorOriginal = new Date(value);

      const ano = valorOriginal.getFullYear();
      const mes = valorOriginal.getMonth() + 1;
      const dia = valorOriginal.getDate();

      setData((aqui) => ({
        ...aqui,
        [name]: `${ano}-${mes.toString().padStart(2, "0")}-${dia
          .toString()
          .padStart(2, "0")}`
      }));
    } else setData({ ...data, [name]: value });
  };

  const AtulizarEventoVeiculo = async () => {
    try {
      setLoading(true);
      await Requicicao.Put({
        endpoint: "/EventoVeiculo",
        data
      });

      Notify({
        type: "success",
        message: "Evento do veiculo atualizado."
      });
      setShowModalFormVeviculo(false);
      StateDataPage();
      LimparData();
    } catch (error) {
      Notify({
        type: "error",
        message: "Erro ao atualizar o evento do veiculo"
      });
    } finally {
      setLoading(false);
    }
  };

  const CriarEventoVeiculo = async () => {
    try {
      setLoading(true);
      await Requicicao.Post({
        endpoint: "/EventoVeiculo",
        data: {
          data: data.data,
          descricao: data.descricao,
          valor: data.valor,
          isDespesa: data.isDespesa,
          veiculoId: data.veiculoId,
          categoriaId: data.categoriaId
        }
      });
      Notify({
        type: "success",
        message: "Evento do veiculo cadastrado."
      });
      setShowModalFormVeviculo(false);
      StateDataPage();
    } catch (error) {
      Notify({
        type: "error",
        message: "Erro ao cadastrar o evento do veiculo"
      });
    } finally {
      setLoading(false);
    }
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
    if (data.id !== "") AtulizarEventoVeiculo();
    else CriarEventoVeiculo();
  };

  const HandleEditClick = (rowData) => {
    const esteItem = lista.filter((x) => x.id === rowData.id)[0];
    setSelectedCategoria(
      listaCategoria.filter((x) => x.code === data.categoriaId)[0]
    );
    setSelectedVeiculo(
      listaVeiculos.filter((x) => x.code === data.veiculoId)[0]
    );
    setDataDataCalendar(() => new Date(esteItem.data));

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
        type: "error",
        message: "Erro de busca do item"
      });
    }
  };

  const InitFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const RemoverEventoVeiculo = async (rowData) => {
    try {
      setLoading(true);
      await Requicicao.Delete({
        endpoint: "/EventoVeiculo",
        params: { id: rowData.id }
      });
      Notify({
        type: "success",
        message: "Evento do veiculo desativado."
      });
      StateDataPage();
    } catch (error) {
      Notify({
        type: "error",
        message: "Erro ao remover o evento do veiculo."
      });
    } finally {
      setLoading(false);
    }
  };

  const Confirm = (event, rowData) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Tem certeza de que deseja deletar esse item?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept: () => {
        RemoverEventoVeiculo(rowData);
      },
      reject: () => {},
      acceptLabel: "Sim",
      rejectLabel: "Não"
    });
  };

  useEffect(() => {
    StateDataPage();
    InitFilters();
  }, []);

  return (
    <div>
      <div className="w-100 d-flex flex-row mb-3">
        <Button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowModalFormVeviculo(true);
            LimparData();
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
                {data.id !== "" ? "Editar " : "Novo "}Evento
              </h5>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="categoria" className="form-label">
                Categoria
              </label>
              <Dropdown
                id="categoria"
                value={selectedCategoria}
                onChange={(e) => {
                  setSelectedCategoria(e.value);
                  HandleChange({
                    target: { name: "categoriaId", value: e.value.code }
                  });
                }}
                options={listaCategoria}
                optionLabel="name"
                placeholder="Selecione um Categoria"
                className="w-100"
              />
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="data" className="form-label">
                Data do Evento
              </label>
              <Calendar
                id="data"
                dateFormat="dd/mm/yy"
                className="w-100"
                value={dataDataCalendar}
                onChange={(e) => {
                  setDataDataCalendar(e.value);
                  HandleChange({
                    target: { name: "data", value: e.value }
                  });
                }}
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
              <label htmlFor="despesa" className="form-label">
                É Despesa
              </label>
              <div className="w-100">
                <InputSwitch
                  id="despesa"
                  checked={data.isDespesa}
                  onChange={(e) =>
                    HandleChange({
                      target: { name: "isDespesa", value: e.value }
                    })
                  }
                />
              </div>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="valor" className="form-label">
                Valor
              </label>
              <InputNumber
                id="valor"
                locale="pt-BR"
                className="w-100"
                value={data.valor}
                onValueChange={(e) =>
                  HandleChange({ target: { name: "valor", value: e.value } })
                }
                minFractionDigits={2}
              />
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="veiculo" className="form-label">
                Veiculo
              </label>
              <Dropdown
                value={selectedVeiculo}
                onChange={(e) => {
                  setSelectedVeiculo(e.value);
                  HandleChange({
                    target: { name: "veiculoId", value: e.value.code }
                  });
                }}
                options={listaVeiculos}
                optionLabel="name"
                placeholder="Selecione um Veiculo"
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
          rows={10}
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage="Nenhum evento encontrado."
          globalFilterFields={["descricao", "placa"]}
          filters={filters}
        >
          <Column field="veiculoPlaca" header="Placa do Veiculo" sortable />
          <Column
            field="isDespesa"
            header="Tipo"
            sortable
            body={(rowData) => (rowData.isDespesa ? "Despesa" : "Receita")}
          />
          <Column
            field="valor"
            header="Valor"
            sortable
            body={(rowData) =>
              `R$ ${MaskUtil.applyMonetaryMask(rowData.valor)}`
            }
          />
          <Column field="descricao" header="Descrição" sortable />
          <Column
            field="data"
            header="Data do Evento"
            sortable
            body={(rowData) => format(new Date(rowData.data), "dd/MM/yyyy")}
          />
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
                <ConfirmPopup />
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
                  <Button
                    className="btn btn-tabela"
                    type="button"
                    icon="bi bi-trash"
                    onClick={(event) => {
                      Confirm(event, rowData);
                    }}
                    tooltip="Deletar item"
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

export default ListaEventoVeiculo;
