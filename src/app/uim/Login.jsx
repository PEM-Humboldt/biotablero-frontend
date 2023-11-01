import { PropTypes } from 'prop-types';
import React, { useState, useRef } from 'react';

import RestAPI from 'utils/restAPI';

const sessionValues = {
  username: "",
  password: "",
}

const Login = ({ setUser }) => {
  const [userValues, setUserValues] = useState( sessionValues )

  const inputName = useRef(null);
  const inputPassword = useRef(null);


  const validateForm = () => {
    // return userValues.username.length > 0 && userValues.password.length > 0;
    return inputName.current.value.length > 0 && inputPassword.current.value.length > 0;
  };

  const handleChange = (event) => {
    // console.log(inputName.current);
    // console.log(inputName.current.value);
    // console.log(inputName.current.id);
    setUserValues({
        // ...userValues,
        // [event.target.id]: `${event.target.value}`,
        [inputName.current.id]: inputName.current.value,
        [inputPassword.current.id]: inputPassword.current.value,
      })
      // console.log(event.target.id, event.target.value);
  };

  return (
    <div className="login">
      {console.log(userValues)}
      <form onSubmit={(event) => event.preventDefault()}>
        <input
          className="loginInput"
          type="text"
          placeholder="Usuario"
          id="username"
          ref={inputName}
          onChange={handleChange}
        />
        <input
          className="loginInput"
          placeholder="Contraseña"
          id="password"
          ref={inputPassword}
          onChange={handleChange}
          type="password"
        />
        <button
          className={validateForm() ? 'loginbtn' : 'loginbtn disabled'}
          title="Ingresar"
          disabled={!validateForm()}
          type="submit"
          onClick={() => {
            RestAPI.requestUser(username, password)
              .then((res) => setUser(res));
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
}

// class Login2 extends Component {
//   constructor(props) {
//     super(props);
//     this.inputName = React.createRef();
//     this.inputPassword = React.createRef();
//     this.state = {
//       username: '',
//       password: '',
//     };
//   }

//   validateForm = () => {
//     const { username, password } = this.state;
//     return username.length > 0 && password.length > 0;
//   }

//   handleChange = (event) => {
//     this.setState({
//       [event.target.id]: `${event.target.value}`,
//     });
//     console.log(event.target.id, event.target.value);
//   }

//   render() {
//     const { username, password } = this.state;
//     const { setUser } = this.props;
//     return (
//       <div className="login">
//         <form onSubmit={(event) => event.preventDefault()}>
//           <input
//             className="loginInput"
//             type="text"
//             placeholder="Usuario"
//             id="username"
//             ref={this.inputName}
//             onChange={this.handleChange}
//           />
//           <input
//             className="loginInput"
//             placeholder="Contraseña"
//             id="password"
//             ref={this.inputPassword}
//             onChange={this.handleChange}
//             type="password"
//           />
//           <button
//             className={this.validateForm() ? 'loginbtn' : 'loginbtn disabled'}
//             title="Ingresar"
//             disabled={!this.validateForm()}
//             type="submit"
//             onClick={() => {
//               RestAPI.requestUser(username, password)
//                 .then((res) => setUser(res));
//             }}
//           >
//             Ingresar
//           </button>
//           <button
//             className="recoverbtn"
//             type="button"
//             title="Acción no disponible"
//           >
//             Recuperar contraseña
//           </button>
//         </form>
//       </div>
//     );
//   }
// }

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
