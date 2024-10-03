import { useState, useEffect } from "react";
import { Route } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { IonReactRouter } from "@ionic/react-router";
import { analytics, pieChart, barChart } from "ionicons/icons";
import {
  IonAlert,
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
import HistoryChart from "../../components/historyChart";

import { getAssets, getPortfolio } from "../../httpClient";
import { Asset, Portfolio } from "../../../../common/types";
import { TITLES, CHART_TYPES, PATHNAMES } from "../../../../common/constants";

import "./styles.css";

const pageTitle = TITLES.MAIN;

const Home: React.FC = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const {
    data: userAssets,
    isError: isAssetsError,
    isLoading: isAssetsLoading,
    failureReason: assetsErrorMessage,
    refetch: refetchAssests,
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
    refetch: refetchPortfolio,
  } = useQuery({
    queryKey: ["getPortfolio"],
    queryFn: getPortfolio,
    retry: 1,
  });

  const handleTabChange = () => {
    if (isAssetsError || isPortfolioError) {
      refetchAssests();
      refetchPortfolio();
    }
  };

  useEffect(() => {
    setShowLoading(isAssetsLoading || isPortfolioLoading);
  }, [isAssetsLoading, isPortfolioLoading]);

  useEffect(() => {
    if (isAssetsError && assetsErrorMessage) {
      setErrorMessage(String(assetsErrorMessage));
      setShowErrorMessage(true);
    }
  }, [isAssetsError]);

  useEffect(() => {
    if (isPortfolioError && portfolioErrorMessage) {
      setErrorMessage(String(portfolioErrorMessage));
      setShowErrorMessage(true);
    }
  }, [isPortfolioError]);

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
                render={() => (
                  <HistoryChart
                    assets={userAssets as Asset[]}
                    portfolio={userPortfolio as Portfolio}
                  />
                )}
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
        <IonAlert
          isOpen={showErrorMessage}
          header="Fetching data error"
          message={errorMessage}
          buttons={["Dismiss"]}
          onDidDismiss={() => setShowErrorMessage(false)}
        />
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
