import { useRef } from "react";
import "../styles/login/login.css";
import { KeyRound } from "lucide-react";
import { server } from "../utils/server";
import { useNavigate } from "react-router-dom";

const LoginElement = (props) => {
  let username = useRef();
  let password = useRef();
  let setAlert = props.alert;
  let Navigate = useNavigate();

  function login(e) {
    e.preventDefault();
    localStorage.removeItem("JWT");
    let user = {
      mail: username.current.value,
      password: password.current.value,
    };
      fetch(server + "users/login", {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.token) {
            localStorage.setItem("JWT", res.token);
            Navigate("/");
          }
          if(res.err){
            setAlert(res.err)
          }
        });
    } 
  // ajouter une fonction qui verifie les id de connexion => envoyé un token stocké dans le local storage qui permet d'intéragir de maniere brut avec les données.
  return (
    <div className="login__component">
      <form>
        <label htmlFor="username">Nom de compte:</label>
        <input ref={username} name="username" type="text" />
        <label htmlFor="password">Mot de passe:</label>

        <input ref={password} name="password" type="password" />
        <button
          onClick={(e) => {
            login(e);
          }}
        >
          Se Connecter <KeyRound />
        </button>
      </form>
    </div>
  );
};
export default LoginElement;
