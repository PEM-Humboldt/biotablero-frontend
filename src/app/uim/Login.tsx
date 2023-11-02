import React, { useState } from "react";

import RestAPI from "utils/restAPI";

interface StateLoginValues {
  username: string;
  password: string;
}

interface LoginProps {
  setUser: ( res: Response ) => React.ReactNode;
}

const defaultStateValues: StateLoginValues = {
  username: "",
  password: "",
};

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [userValues, setUserValues] =
    useState<StateLoginValues>(defaultStateValues);

  const validateForm = () => {
    return userValues.username.length > 0 && userValues.password.length > 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserValues({
      ...userValues,
      [event.target.id]: `${event.target.value}`,
    });
  };

  return (
    <div className="login">
      <form onSubmit={(event) => event.preventDefault()}>
        <input
          className="loginInput"
          type="text"
          placeholder="Usuario"
          id="username"
          onChange={handleChange}
        />
        <input
          className="loginInput"
          placeholder="Contraseña"
          id="password"
          onChange={handleChange}
          type="password"
        />
        <button
          className={validateForm() ? "loginbtn" : "loginbtn disabled"}
          title="Ingresar"
          disabled={!validateForm()}
          type="submit"
          onClick={() => {
            RestAPI.requestUser(userValues.username, userValues.password).then(
              (res) => setUser(res)
            );
          }}
        >
          Ingresar
        </button>
        <button
          className="recoverbtn"
          type="button"
          title="Acción no disponible"
        >
          Recuperar contraseña
        </button>
      </form>
    </div>
  );
};

export default Login;
