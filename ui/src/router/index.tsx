import { IonRouterOutlet, ReactComponentOrElement } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";

import Login from "./../pages/login";
import Home from "./../pages/home";

import { getAuthStatus, getCurrentUserAccessToken } from "./../services/auth";
import { PATHNAMES, AUTH_STATUS } from "../../../common/constants";

const authStatus: string | null = getAuthStatus();
const userAccesToken: string | null = getCurrentUserAccessToken();

const isConnected: Boolean = Boolean(
  authStatus && authStatus === AUTH_STATUS.CONNECTED && userAccesToken
);

const DEFAULT_PAGE: string = PATHNAMES.LOGIN;

interface ProtectedRouteProps {
  children: ReactComponentOrElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: any) => {
  if (!isConnected) {
    return <Redirect to={DEFAULT_PAGE} />;
  }

  return children;
};

interface AppRouterProps {}

const AppRouter: React.FC<AppRouterProps> = () => (
  <IonRouterOutlet>
    <Route exact path={PATHNAMES.HOME}>
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    </Route>

    <Route exact path={PATHNAMES.LOGIN}>
      <Login />
    </Route>

    <Route exact path={PATHNAMES.ROOT}>
      <Redirect to={DEFAULT_PAGE} />
    </Route>

    <Redirect to={PATHNAMES.ROOT} />
  </IonRouterOutlet>
);

export default AppRouter;
