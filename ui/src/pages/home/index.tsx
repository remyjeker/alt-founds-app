import { useState, useEffect } from "react";
import { Route } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { IonReactRouter } from "@ionic/react-router";
import { analytics, pieChart, barChart } from "ionicons/icons";
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";

import Header from "../../components/header";
import BalanceChart from "../../components/balanceChart";

import { getAssets, getPortfolio } from "../../httpClient";
import { Asset, Portfolio } from "../../../../common/types";
import { TITLES, CHART_TYPES, PATHNAMES } from "../../../../common/constants";

import "./styles.css";

const pageTitle = TITLES.MAIN;

const Home: React.FC = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const {
    data: userAssets,
    isError: isAssetsError,
    isLoading: isAssetsLoading,
    failureReason: assetsErrorMessage,
  } = useQuery({
    queryKey: ["getAssets"],
    queryFn: getAssets,
    retry: 1,
  });

  const {
    data: userPortfolio,
    isError: isPortfolioError,
    isLoading: isPortfolioLoading,
    failureReason: portfolioErrorMessage,
  } = useQuery({
    queryKey: ["getPortfolio"],
    queryFn: getPortfolio,
    retry: 1,
  });

  const handleTabChange = (e: any) => {
    // console.log("TAB CHANGED", e);
    // trigger chart generation
  };

  useEffect(() => {
    console.log("--- HOME MOUNTED ---");
  }, []);

  useEffect(() => {
    // setShowLoading(isAssetsLoading);
    setShowLoading(isAssetsLoading || isPortfolioLoading);
  }, [isAssetsLoading, isPortfolioLoading]);

  useEffect(() => {
    if (isAssetsError && assetsErrorMessage) {
      // setErrorMessage(assetsErrorMessage)
      // setErrorMessage(portfolioErrorMessage)
      setShowError(true);
    }
  }, [isAssetsError]);

  return (
    <IonPage>
      <Header title={pageTitle} />
      <IonContent>
        <IonReactRouter>
          <IonTabs onIonTabsDidChange={handleTabChange}>
            <IonRouterOutlet>
              <Route
                path={PATHNAMES.HOME}
                exact={true}
                render={() => (
                  <BalanceChart
                    charType={CHART_TYPES.DOUGHNUT}
                    assets={userAssets as Asset[]}
                    portfolio={userPortfolio as Portfolio}
                  />
                )}
              />
              <Route
                path={PATHNAMES.TABLE}
                exact={true}
                render={() => (
                  <BalanceChart
                    charType={CHART_TYPES.BAR}
                    assets={userAssets as Asset[]}
                    portfolio={userPortfolio as Portfolio}
                  />
                )}
              />
              <Route
                path={PATHNAMES.HISTORY}
                exact={true}
                render={() => <h1>History</h1>}
              />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href={PATHNAMES.HOME}>
                <IonIcon icon={pieChart} />
                <IonLabel>Balance</IonLabel>
              </IonTabButton>
              <IonTabButton tab="table" href={PATHNAMES.TABLE}>
                <IonIcon icon={barChart} />
                <IonLabel>Table</IonLabel>
              </IonTabButton>
              <IonTabButton tab="history" href={PATHNAMES.HISTORY}>
                <IonIcon icon={analytics} />
                <IonLabel>History</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>

        {/* TODO HERE */}
        {/* portfolioErrorMessage */}
        {showError && <span>{String(assetsErrorMessage)}</span>}

        <IonLoading
          isOpen={showLoading}
          spinner="circles"
          message="Loading..."
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
