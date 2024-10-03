import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { IonContent } from "@ionic/react";

import Chart from "chart.js/auto";

import { Asset, Portfolio, Position } from "../../../../common/types";
import { TITLES, COLORS_PALETTE } from "../../../../common/constants";

import "./styles.css";

const GRID_CONFIG = {
  grid: {
    color: "#242424",
  },
};

interface IHistoryChartProps {
  assets: Asset[] | undefined;
  portfolio: Portfolio | undefined;
}

const HistoryChart: React.FC<IHistoryChartProps> = ({
  assets = [],
  portfolio = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [chart, setChart] = useState<any>(null);

  const getAssetLabel = (assetId: String): String => {
    const index: number = [...assets].findIndex(
      (asset: Asset) => asset.id === assetId
    );

    if (index >= 0) {
      const { name, type }: Asset = assets[index];

      return String(name).concat(" (", String(type).toUpperCase(), ")");
    }

    return assetId;
  };

  const generateChartDataSet = () => {
    const { positions } = portfolio as Portfolio;
    const positionsLength: number = positions.length;

    let globalXChart: String[] = [];
    let totalYChart: number[] = [];
    let assetsYChart: any = [];
    let amountAtTransactionTime: number = 0;

    positions.forEach((position: Position, positionIndex: number) => {
      const formatedDate = moment(Number(position.asOf)).format("YYYY-MM-DD");
      globalXChart.push(formatedDate);

      const amount = Number(position.price) * Number(position.quantity);
      const combined = Number(amountAtTransactionTime + amount);
      totalYChart.push(combined);

      const label = getAssetLabel(position.asset);
      const assetLine = Array.from({ length: positionsLength }).map(
        (raise, index) => (positionIndex >= index ? 0 : amount)
      );
      const color = COLORS_PALETTE[positionIndex];

      assetsYChart.push({
        label: label,
        data: assetLine,
        borderColor: color,
        backgroundColor: color,
      });

      amountAtTransactionTime += amount;
    });

    return {
      labels: globalXChart,
      datasets: [
        ...assetsYChart,
        {
          label: "TOTAL",
          data: totalYChart,
          borderColor: "#ffffff",
          backgroundColor: "#acacac",
        },
      ],
    };
  };

  const generateChart = () => {
    if (chart) {
      chart.data = generateChartDataSet();
      chart.update();

      return;
    }

    if (canvasRef?.current?.attributes?.length) {
      return;
    }

    setChart(
      // @ts-ignore
      new Chart(canvasRef?.current, {
        type: "line",
        data: generateChartDataSet(),
        options: {
          layout: {
            padding: 16,
          },
          scales: {
            x: { ...GRID_CONFIG },
            y: { ...GRID_CONFIG },
          },
        },
      })
    );
  };

  useEffect(() => {
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (assets && assets?.length && portfolio) {
      generateChart();
    }
  }, [assets, portfolio]);

  return (
    <IonContent>
      <div className="ion-padding">
        <span className="breadcrumbs">
          {TITLES.ACCOUNT + " > " + TITLES.HISTORY}
        </span>
        <h4 className="ion-text-center">{TITLES.EVOLUTION}</h4>
        <div className="history-chart-container">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </IonContent>
  );
};

export default HistoryChart;
