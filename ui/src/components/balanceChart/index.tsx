import { useState, useEffect, useRef } from "react";
import { IonContent, IonItem, IonSelect, IonSelectOption } from "@ionic/react";

import Chart, { ChartComponent } from "chart.js/auto";

import { Asset, Portfolio } from "../../../../common/types";
import { TITLES } from "../../../../common/constants";

import "./styles.css";

const colorsMapping = [
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255, 205, 86)",
  "rgb(160, 255, 12)",
  "rgb(2, 100, 234)",
];

interface IBalanceChartProps {
  // TODO: CHECK TYPE
  assets: String | Asset[] | undefined;
  portfolio: String | Portfolio | undefined;
}

const BalanceChart: React.FC<IBalanceChartProps> = ({
  assets = [],
  portfolio = null,
}) => {
  const canvasRef = useRef<any>(null);

  const [balanceChart, setBalanceChart] = useState<ChartComponent | null>(null);

  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<String>("");

  // const data = {
  //   labels: ["Red", "Blue", "Yellow"],
  //   datasets: [
  //     {
  //       label: "Current balance",
  //       data: [300, 50, 100],
  //       backgroundColor: [
  //         "rgb(255, 99, 132)",
  //         "rgb(54, 162, 235)",
  //         "rgb(255, 205, 86)",
  //       ],
  //       hoverOffset: 4,
  //     },
  //   ],
  // };

  // TODO: TO FIX
  const getAssetLabel = (assetId: String): String => {
    const test = assets.findIndex((x: Asset) => x.id === assetId);

    if (test >= 0) {
      const { name, type }: Asset = assets[test];

      return String(name).concat(" (", String(type), ")");
    }

    return assetId;
  };

  const generateChartData = () => {
    // if (!portfolio || !assets) {
    //   return {};
    // }

    const { positions } = portfolio as Portfolio;

    let labels: String[] = [];
    let totalPrices: String[] = [];
    let colors: String[] = [];

    positions.forEach((position, index) => {
      // 1
      const assetLabel = getAssetLabel(position.asset);
      labels.push(assetLabel);

      // 2
      const totalPrice = Number(
        Number(position.price) * Number(position.quantity)
      );
      // .toFixed(2);
      totalPrices.push(String(totalPrice));

      // 3
      const color = colorsMapping[index];
      colors.push(color);
    });

    // console.log(labels, totalPrices, colors);

    return {
      labels: labels,
      datasets: [
        {
          label: "Total amount (USD)",
          data: totalPrices,
          backgroundColor: colors,
          hoverOffset: 4,
        },
      ],
    };
  };

  const generateChart = () => {
    console.log("generateChart", balanceChart, canvasRef);

    const { current: canvasRefCurrentElement } = canvasRef;

    if (canvasRefCurrentElement) {
      setBalanceChart(
        new Chart(canvasRefCurrentElement, {
          type: "doughnut",
          // data: data,
          data: generateChartData(),
        })
      );
    }
  };

  const unmountChart = () => {
    console.log("unmountChart");

    canvasRef.current = null;

    setBalanceChart(null);
  };

  useEffect(() => {
    console.log("--- CHART MOUNTED ---");

    return () => {
      console.log("--- CHART UNMOUNTED ---");
      unmountChart();
    };
  }, []);

  useEffect(() => {
    // console.log("CHART BALANCE - DATA RECEIVED", assets, portfolio);
    console.log("TEST", assets, Object.keys(assets), Object.values(assets));

    if (assets && assets?.length && portfolio) {
      generateChart();
    }
  }, [assets, portfolio]);

  const handleSelectedAssetChange = (e: any) => {
    // console.log("handleSelectedAssetChange", e);

    setSelectedAsset(e?.detail?.value);
  };

  return (
    <IonContent>
      <div className="ion-padding">
        <span>{"My account > Balance"}</span>
        <h3 className="ion-text-center">{TITLES.CURRENT_BALANCE}</h3>

        {/* {assets && <span>{JSON.stringify(assets)}</span>} */}

        <IonItem>
          <IonSelect
            color={"dark"}
            aria-label="fruit"
            placeholder="Select asset..."
            onIonChange={handleSelectedAssetChange}
          >
            {/* ITERATE OVER availableAssets */}
            <IonSelectOption value="apples">Apples</IonSelectOption>
            <IonSelectOption value="oranges">Oranges</IonSelectOption>
            <IonSelectOption value="bananas">Bananas</IonSelectOption>
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
