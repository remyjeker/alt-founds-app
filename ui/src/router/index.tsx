import { ReactElement } from "react";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";

import Login from "./../pages/login";
import Home from "./../pages/home";

import { getAuthStatus, getCurrentUserAccessToken } from "./../services/auth";
import { PATHNAMES, AUTH_STATUS } from "../../../common/constants";

const authStatus: string | null = getAuthStatus();
const userAccesToken: string | null = getCurrentUserAccessToken();

const isConnected: boolean = Boolean(
  authStatus && authStatus === AUTH_STATUS.CONNECTED && userAccesToken
);

const DEFAULT_PAGE: string = PATHNAMES.LOGIN;

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isConnected) {
    return <Redirect to={DEFAULT_PAGE} />;
  }

  return children;
};

const AppRouter: React.FC<{}> = () => (
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
