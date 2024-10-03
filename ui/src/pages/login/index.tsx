import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { login } from "../../httpClient";
import { setAuthConfig } from "../../services/auth";
import { LoginParams, UserProfile } from "../../../../common/types";
import { PATHNAMES, TITLES } from "../../../../common/constants";

import "./styles.css";

const pageTitle = TITLES.MAIN + " / Connect";

const Login: React.FC = () => {
  const history = useHistory();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [hasCredentials, setHasCredentials] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const handleUsernameChanged = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChanged = (event: any) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    setHasCredentials(
      Boolean(username && username !== "" && password && password !== "")
    );
  }, [username, password]);

  const navigateToHomePage = () => {
    history.push(PATHNAMES.HOME);
  };

  const processLogin = async () => {
    const credentials: LoginParams = {
      username: username,
      password: password,
    };

    await login(credentials)
      .then((user: UserProfile) => {
        if (setAuthConfig(user)) {
          navigateToHomePage();
        }
      })
      .catch((errorMessage: string) => {
        setErrorMessage(errorMessage);
        setShowErrorMessage(true);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{pageTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard className="login-card">
          <IonCardHeader>
            <IonCardTitle>Login</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonInput
                label="Username"
                placeholder="username"
                value={username}
                onIonInput={handleUsernameChanged}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="password"
                label="Password"
                placeholder="password"
                value={password}
                onIonInput={handlePasswordChanged}
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </IonItem>
            <div className="ion-text-center ion-margin-top">
              <IonButton disabled={!hasCredentials} onClick={processLogin}>
                Login
              </IonButton>
            </div>
            <IonAlert
              isOpen={showErrorMessage}
              header="Authentication failed"
              message={errorMessage}
              buttons={["Dismiss"]}
              onDidDismiss={() => setShowErrorMessage(false)}
            />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
