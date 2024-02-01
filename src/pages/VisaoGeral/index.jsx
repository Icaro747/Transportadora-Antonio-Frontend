import React, { useState, useEffect } from "react";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chart } from "primereact/chart";

import { useLoading } from "context/LoadingContext";
import { useNotification } from "context/NotificationContext";

import Api from "utils/Api";
import MaskUtil from "utils/MaskUtil";

function VisaoGeral() {
  const { setLoading } = useLoading();
  const Requicicao = new Api();
  const Notify = useNotification();

  const [dataDataCalendar, setDataDataCalendar] = useState(null);

  const [data, setData] = useState(null);

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const StateDataPage = async () => {
    try {
      setLoading(true);
      let NesAno = "";
      if (dataDataCalendar !== null) {
        NesAno = `${new Date(dataDataCalendar).getMonth() + 1 < 10 ? `0${new Date(dataDataCalendar).getMonth() + 1}` : new Date(dataDataCalendar).getMonth() + 1}/${new Date(dataDataCalendar).getFullYear()}`;
      } else {
        NesAno = `${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}/${new Date().getFullYear()}`;
      }
      const novaData = await Requicicao.Get({
        endpoint: "/Graficos/VisaoGeral",
        params: {
          mesAno: NesAno
        }
      });
      setData(novaData);
    } catch (error) {
      Notify({
        type: "error",
        message: "Erro ao carregar os dados da Visão Geral."
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTotal = (label, value, color) => (
    <div className={`text-center bg-${color} p-3 rounded`}>
      <h1 className="text-white">R$ {MaskUtil.applyMonetaryMask(value)}</h1>
      <h2 className="text-white">{label}</h2>
    </div>
  );

  useEffect(() => {
    StateDataPage();
  }, []);

  useEffect(() => {
    if (data !== null) {
      const dataGrafico = {
        labels: data.veiculos.map((item) => item.placa),
        datasets: [
          {
            label: "Despesas",
            data: data.veiculos.map((item) => item.totalDespesa),
            backgroundColor: "#dc3545",
            borderColor: "#dc3545",
            borderWidth: 1
          },
          {
            label: "Receitas",
            data: data.veiculos.map((item) => item.totalReceita),
            backgroundColor: "#198754",
            borderColor: "#198754",
            borderWidth: 1
          }
        ]
      };
      const options = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      setChartData(dataGrafico);
      setChartOptions(options);
    }
  }, [data]);

  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-3">
          <form
            className="card p-3"
            onSubmit={(event) => {
              event.preventDefault();
              StateDataPage();
            }}
          >
            <div>
              <label htmlFor="data" className="form-label">
                Data
              </label>
              <Calendar
                id="data"
                view="month"
                dateFormat="mm/yy"
                className="w-100"
                value={dataDataCalendar}
                onChange={(e) => {
                  setDataDataCalendar(e.value);
                }}
              />
            </div>
            <div className="col-md-12 mt-3">
              <div className="w-100 d-flex flex-row-reverse">
                <Button
                  type="submit"
                  label="Buscar"
                  className="btn btn-primary"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      {data !== null && (
        <div className="card p-3 mt-3">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <div className="d-flex justify-content-center align-items-center gap-3">
              {renderTotal("Total de Receitas", data.totalReceita, "success")}
              <div>
                <h1 className="text-secondary">-</h1>
              </div>
              {renderTotal("Total de Despesas", data.totalDespesa, "danger")}
              <div>
                <h1 className="text-secondary">=</h1>
              </div>
              {renderTotal("Total de Lucro", data.totalLucro, "info")}
            </div>
          </div>
        </div>
      )}
      <div className="card p-3 mt-3">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default VisaoGeral;
