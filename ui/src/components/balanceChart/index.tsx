import { useState, useEffect, useRef } from "react";
import { IonContent } from "@ionic/react";

import Chart from "chart.js/auto";

import { Assets } from "../../../../common/types";
import { TITLES } from "../../../../common/constants";

import "./styles.css";

interface IBalanceChartProps {
  assets: String | Assets[] | undefined;
  portfolio?: any;
}

const BalanceChart: React.FC<IBalanceChartProps> = ({
  assets = [],
  portfolio = [],
}) => {
  const canvasRef = useRef<any>(null);

  const [balanceChart, setBalanceChart] = useState<any>(null);

  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "Current balance",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const generateChart = () => {
    if (balanceChart) {
      unmountChart();
    }

    const { current: canvasRefCurrentElement } = canvasRef;

    if (canvasRefCurrentElement) {
      setBalanceChart(
        new Chart(canvasRefCurrentElement, {
          type: "doughnut",
          data: data,
        })
      );
    }
  };

  const unmountChart = () => {
    canvasRef.current = null;

    setBalanceChart(null);
  };

  useEffect(() => {
    console.log("--- CHART MOUNTED ---");
  }, []);

  useEffect(() => {
    return () => {
      console.log("--- CHART UNMOUNTED ---");

      unmountChart();
    };
  }, []);

  useEffect(() => {
    console.log("CHART assets RECEIVED", assets);

    if (assets && assets?.length) {
      generateChart();
    }
  }, [assets]);

  return (
    <IonContent>
      <div className="ion-padding">
        <span>{"My account > Balance"}</span>
        <h3 className="ion-text-center">{TITLES.CURRENT_BALANCE}</h3>
        {assets && <span>{JSON.stringify(assets)}</span>}
        <div className="chart-container">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </IonContent>
  );
};

export default BalanceChart;
