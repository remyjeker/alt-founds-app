import { useState, useEffect } from "react";
import { Redirect, Route } from "react-router";
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

import { getAssets } from "../../httpClient";
import { TITLES } from "../../../../common/constants";

import "./styles.css";

const pageTitle = TITLES.MAIN;

const Home: React.FC = () => {
  // const [showLoading, setShowLoading] = useState<boolean>(true);

  // TODO: HANDLING ERROR HERE
  const {
    data: allAssets,
    isLoading: isAllAssetsLoading,
    // isError: isAllAssetsError,
    // refetch,
  } = useQuery({
    queryKey: ["getAssets"],
    queryFn: getAssets,
  });

  useEffect(() => {
    // console.log("mounting", allAssets, isAllAssetsLoading);
  }, []);

  useEffect(() => {
    // console.log("isAllAssetsLoading", isAllAssetsLoading);
  }, [isAllAssetsLoading]);

  return (
    <IonPage>
      <Header title={pageTitle} />
      <IonContent>
        {isAllAssetsLoading ? (
          <IonLoading isOpen={true} spinner="circles" message="Loading..." />
        ) : (
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Redirect exact path="/" to="/home" />
                <Route
                  path="/home"
                  render={() => (
                    <div>
                      <h1>Home</h1>
                      <span>{JSON.stringify(allAssets)}</span>
                    </div>
                  )}
                  exact={true}
                />
                <Route
                  path="/table"
                  render={() => <h1>Table</h1>}
                  exact={true}
                />
                <Route
                  path="/history"
                  render={() => <h1>History</h1>}
                  exact={true}
                />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={pieChart} />
                  <IonLabel>Portfolio</IonLabel>
                </IonTabButton>
                <IonTabButton tab="table" href="/table">
                  <IonIcon icon={barChart} />
                  <IonLabel>Table</IonLabel>
                </IonTabButton>
                <IonTabButton tab="history" href="/history">
                  <IonIcon icon={analytics} />
                  <IonLabel>History</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
