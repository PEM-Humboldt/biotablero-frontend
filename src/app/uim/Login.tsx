import React, { useState } from "react";
import {
  requestAccessToken,
  isResponseRequestError,
  isResponseAuthData,
} from "utils/authAPI";
import type { LoginUimProps } from "app/Uim";
import { uiText } from "app/uim/login/uiText";
import { parseUserFromJwt, setTokensInLS } from "app/uim/utils/JWTstorage";

export function Login({ setUser }: Pick<LoginUimProps, "setUser">) {
  const [loginError, setLoginError] = useState("");
  const [loginData, setLoginData] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.id]: `${event.target.value}`,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await requestAccessToken(
        loginData.username,
        loginData.password,
      );

      if (isResponseRequestError(res)) {
        setLoginError(res.status > 499 ? uiText.error[500] : uiText.error[400]);
        return;
      }

      if (!isResponseAuthData(res)) {
        setLoginError(uiTXT.error[500]);
        return;
      }

      setTokensInLS(res.access_token, res.refresh_token);
      const user = parseUserFromJwt(res.access_token);

      // HACK: mientras se cuadran los usuarios de compensaciones en el
      // keycloak, para habilitar el uso con el usuario de la GEB
      if (user.username === "geb") {
        user.id = 1;
        user.name = "Grupo Energía Bogotá";
        user.company = { id: 1, name: "Grupo Energía Bogotá" };
      }

      void setUser(user);
    } catch (err) {
      console.warn(err);
      void setLoginError(uiText.error[500]);
    }
  };

  const validateForm =
    loginData.username.length > 0 && loginData.password.length > 0;

  return (
    <div className="login">
      <form onSubmit={(event) => event.preventDefault()}>
        {loginError !== "" && (
          <div style={{ color: "red", marginBottom: "0.5rem" }}>
            {loginError}
          </div>
        )}
        <label>
          {uiText.form.name.label}
          <input
            className="loginInput"
            type="text"
            id="username"
            placeholder={uiText.form.name.placeholder}
            onChange={handleChange}
          />
        </label>

        <label>
          {uiText.form.pass.label}
          <input
            className="loginInput"
            type="password"
            id="password"
            onChange={handleChange}
          />
        </label>

        <button
          className={validateForm ? "loginbtn" : "loginbtn disabled"}
          disabled={!validateForm}
          type="button"
          onClick={() => void handleLogin()}
        >
          {uiText.form.buttons.login}
        </button>

        <button className="recoverbtn" type="button">
          {uiText.form.buttons.recovery}
        </button>
      </form>
    </div>
  );
}
