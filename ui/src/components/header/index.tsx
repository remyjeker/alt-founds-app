import { useHistory } from "react-router-dom";
import {
  getPlatforms,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";

import {
  getAuthStatus,
  getCurrentUserPicture,
  getCurrentUserUsername,
  logout,
} from "../../services/auth";
import { AUTH_STATUS, PATHNAMES, TITLES } from "../../../../common/constants";

import "./styles.css";

interface IHeaderProps {
  title?: string;
}

const Header: React.FC<IHeaderProps> = ({ title = TITLES.MAIN }) => {
  const history = useHistory();
  const platforms = getPlatforms();
  const isMobile = platforms.includes("mobile");

  const authStatus = getAuthStatus();
  const isConnected = Boolean(authStatus === AUTH_STATUS.CONNECTED);

  const processLogout = () => {
    if (logout()) {
      navigateToRootPage();
    }
  };

  const navigateToRootPage = () => {
    history.push(PATHNAMES.ROOT);
  };

  const navigateToLoginPage = () => {
    history.push(PATHNAMES.LOGIN);
  };

  const loggedInTemplate = () => (
    <IonButtons slot="end">
      <img
        className="profile-image"
        src={getCurrentUserPicture() || ""}
        alt="picture"
      />
      <span
        className="profile-username ion-margin-start"
        style={{ textTransform: "capitalize" }}
      >
        {getCurrentUserUsername() || ""}
      </span>
      <IonButton onClick={processLogout}>
        <IonIcon
          slot="icon-only"
          icon={logOutOutline}
          color="white"
          aria-hidden="true"
        />
      </IonButton>
    </IonButtons>
  );

  const loggedOutTemplate = () => (
    <IonButtons slot="end">
      <IonButton onClick={navigateToLoginPage}>Login</IonButton>
    </IonButtons>
  );

  return (
    <IonHeader collapse={isMobile ? "condense" : undefined}>
      <IonToolbar>
        <IonTitle size={isMobile ? "small" : "large"} slot="start">
          {title}
        </IonTitle>
        {isConnected ? loggedInTemplate() : loggedOutTemplate()}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
