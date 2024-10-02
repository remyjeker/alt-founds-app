import { useState, useEffect, useRef } from "react";
import { IonContent, IonItem, IonSelect, IonSelectOption } from "@ionic/react";
import Chart from "chart.js/auto";

import { Asset, Portfolio } from "../../../../common/types";
import { CURRENT_CURRENCY, TITLES } from "../../../../common/constants";

import "./styles.css";

const colorsPaletteMapping = [
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255, 205, 86)",
  "rgb(160, 255, 12)",
  "rgb(136, 255, 255)",
  "rgb(136, 255, 255)",
  "rgb(172, 115, 255)",
];

interface IBalanceChartProps {
  assets: Asset[] | undefined;
  portfolio: Portfolio | undefined;
}

const BalanceChart: React.FC<IBalanceChartProps> = ({
  assets = [],
  portfolio = null,
}) => {
  let currentChart: Chart<any> | null = null;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentBalance, setCurrentBalance] = useState<String>("");

  const [selectedAsset, setSelectedAsset] = useState<String | null>(null);

  const generateCurrentBalance = (): void => {
    if (!portfolio) {
      return;
    }

    let sum: number = 0;

    const { positions } = portfolio as Portfolio;

    positions.forEach((position) => {
      const positionAmount = Number(
        Number(position.price) * Number(position.quantity)
      );

      sum += positionAmount;
    });

    const formatedCurrentBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENT_CURRENCY,
    }).format(sum);

    setCurrentBalance(formatedCurrentBalance);
  };

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

    let labels: String[] = [];
    let totalPrices: String[] = [];
    let colors: String[] = [];

    positions
      .filter((position) =>
        Boolean(!selectedAsset || position.asset === selectedAsset)
      )
      .forEach((position, index) => {
        const label = getAssetLabel(position.asset);
        labels.push(label);

        const totalPrice = Number(
          Number(position.price) * Number(position.quantity)
        );
        totalPrices.push(totalPrice.toFixed(2));

        const color = colorsPaletteMapping[index];
        colors.push(color);
      });

    return {
      labels: [...labels],
      datasets: [
        {
          label: `Total amount (${CURRENT_CURRENCY})`,
          data: [...totalPrices],
          backgroundColor: [...colors],
          hoverOffset: 16,
        },
      ],
    };
  };

  const generateChart = () => {
    currentChart = new Chart(canvasRef?.current, {
      type: "doughnut",
      data: generateChartDataSet(),
    });
  };

  const destroyChart = () => {
    if (currentChart) {
      currentChart.destroy();

      return true;
    }
  };

  useEffect(() => {
    return () => {
      destroyChart();
    };
  }, []);

  useEffect(() => {
    if (assets && assets?.length && portfolio) {
      generateCurrentBalance();
      generateChart();
    }
  }, [assets, portfolio]);

  const handleSelectedAssetChange = (event: CustomEvent) => {
    setSelectedAsset(event?.detail?.value);

    // TODO: Verify update
    if (destroyChart()) {
      generateChart();
    }
  };

  return (
    <IonContent>
      <div className="ion-padding">
        <span className="breadcrumbs">
          {TITLES.ACCOUNT + " > " + TITLES.CURRENT_BALANCE}
        </span>
        <h3 className="ion-text-center">{TITLES.CURRENT_BALANCE} :</h3>
        {currentBalance !== "" && (
          <h1 className="ion-text-center">{currentBalance}</h1>
        )}
        <IonItem className="ion-margin-top ion-padding-horizontal">
          <IonSelect
            color={"dark"}
            aria-label="asset"
            placeholder="Select asset class..."
            onIonChange={handleSelectedAssetChange}
            value={selectedAsset}
          >
            <IonSelectOption value={null}>ALL</IonSelectOption>
            {assets.map((asset: Asset) => (
              <IonSelectOption value={asset.id}>{asset.name}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <div className="chart-container">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </IonContent>
  );
};

export default BalanceChart;
