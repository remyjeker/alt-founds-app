import { useState, useEffect, useRef } from "react";
import { IonContent, IonItem, IonSelect, IonSelectOption } from "@ionic/react";

import Chart from "chart.js/auto";

import { Asset, Portfolio, Position } from "../../../../common/types";
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [chart, setChart] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<String | null>(null);
  const [currentBalance, setCurrentBalance] = useState<String>("");
  const [userAssetClasses, setUserAssetClasses] = useState<String[]>([]);

  const getFormatedCurrencyPrice = (value: number): String => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENT_CURRENCY,
    }).format(value);
  };

  const generateCurrentBalance = (): void => {
    let amount: number = 0;

    const { positions } = portfolio as Portfolio;

    positions.forEach((position) => {
      const positionAmount = Number(
        Number(position.price) * Number(position.quantity)
      );

      amount += positionAmount;
    });

    setCurrentBalance(getFormatedCurrencyPrice(amount));
  };

  const handleSelectedAssetChange = (event: CustomEvent) => {
    const selectedAssetId: String = event?.detail?.value;

    setSelectedAsset(selectedAssetId);

    generateChart(selectedAssetId);
  };

  const defineUniqueAssetClasses = () => {
    const { positions } = portfolio as Portfolio;

    let userAssetIds: String[] = [];

    positions.forEach((position: Position) => {
      if (!userAssetIds.includes(position.asset)) {
        userAssetIds.push(position.asset);
      }
    });

    setUserAssetClasses(userAssetIds);
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

  const generateChartDataSet = (assetId: String | null = null) => {
    const { positions } = portfolio as Portfolio;

    let labels: String[] = [];
    let totalPrices: String[] = [];
    let colors: String[] = [];

    positions
      .filter((position: Position) =>
        Boolean(!assetId || position.asset === assetId)
      )
      .forEach((position: Position, index: number) => {
        const label = getAssetLabel(position.asset);
        const totalPrice = Number(
          Number(position.price) * Number(position.quantity)
        ).toFixed(2);
        const color = colorsPaletteMapping[index];

        labels.push(label);
        totalPrices.push(totalPrice);
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

  const generateChart = (assetId: String | null = null) => {
    if (chart) {
      chart.data = generateChartDataSet(assetId);
      chart.update();

      return;
    }

    if (canvasRef?.current?.attributes?.length) {
      return;
    }

    setChart(
      new Chart(canvasRef?.current, {
        type: "doughnut",
        data: generateChartDataSet(),
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
      defineUniqueAssetClasses();
      generateCurrentBalance();
      generateChart();
    }
  }, [assets, portfolio]);

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
        <div className="asset-class-filter-container">
          <IonItem className="ion-margin-top ion-padding-horizontal">
            <IonSelect
              color={"dark"}
              aria-label="asset"
              placeholder="Select asset class..."
              onIonChange={handleSelectedAssetChange}
              value={selectedAsset}
            >
              <IonSelectOption value={null}>ALL ASSET CLASSES</IonSelectOption>
              {assets
                .filter((asset: Asset) => userAssetClasses.includes(asset.id))
                .map((asset: Asset, index) => (
                  <IonSelectOption key={index} value={asset.id}>
                    {asset.name}
                  </IonSelectOption>
                ))}
            </IonSelect>
          </IonItem>
        </div>
        <div className="chart-container">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </IonContent>
  );
};

export default BalanceChart;
