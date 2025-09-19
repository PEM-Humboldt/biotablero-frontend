import React, { useState } from "react";
import {
  requestAccessToken,
  isResponseRequestError,
  isResponseAuthData,
} from "utils/authAPI";
import type { LoginUimProps } from "app/Uim";
import { parseUserFromJwt, setTokensInLS } from "app/uim/utils/JWTstorage";

const uiTXT = {
  form: {
    name: {
      label: "Nombre de usuario",
      placeholder: "Apoddo",
    },
    pass: {
      label: "Contraseña",
    },
    buttons: {
      login: "Ingresar",
      recovery: "Recuperar contraseña",
    },
  },
  error: {
    400: "El usuario y/o la contraseña no son correctas",
    500: "No es posible procesar tu ingreso, intentalo de nuevo más tarde",
  },
};

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
        setLoginError(res.status > 499 ? uiTXT.error[500] : uiTXT.error[400]);
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
      void setLoginError(uiTXT.error[500]);
    }
  };

  const validateForm =
    loginData.username.length > 0 && loginData.password.length > 0;

  return (
    <div className="login">
      <form onSubmit={(event) => event.preventDefault()}>
        {loginError !== "" && <div>{loginError}</div>}
        <label>
          {uiTXT.form.name.label}
          <input
            className="loginInput"
            type="text"
            placeholder={uiTXT.form.name.placeholder}
            id="username"
            onChange={handleChange}
          />
        </label>

        <label>
          {uiTXT.form.pass.label}
          <input
            className="loginInput"
            placeholder="Contraseña"
            id="password"
            onChange={handleChange}
            type="password"
          />
        </label>

        <button
          className={validateForm ? "loginbtn" : "loginbtn disabled"}
          disabled={!validateForm}
          type="button"
          onClick={() => void handleLogin()}
        >
          {uiTXT.form.buttons.login}
        </button>

        <button className="recoverbtn" type="button">
          {uiTXT.form.buttons.recovery}
        </button>
      </form>
    </div>
  );
}
