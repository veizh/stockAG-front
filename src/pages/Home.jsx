import {  useRef } from "react";
import "../styles/home/home.css";
import { PackageSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { server } from "../utils/server";
import { addHeaderJWT } from "../utils/header";
const Home = (props) => {
  let setAlert = props.alert
  let refInput = useRef();
  let Navigate= useNavigate()
  
    function searchProduct(){
      if(!refInput.current.value)return
      fetch(server+"products/getOne/"+ refInput.current.value.toUpperCase(),{headers:addHeaderJWT(),method:"GET"}).then(res=>res.json()).then(res=>{
        if(!res.error){
          return Navigate(`/product/${refInput.current.value.toUpperCase()}`)
        }
        setAlert("Ce produit n'existe pas !")
        return 
      })

    }

  return (
    <div className="home__component">
      <div className="input__container">
        <label htmlFor="Id">Trouver un produit par sa référence:</label>
        <div className="subcontainer">
          <input ref={refInput} placeholder="AAAA" type="text" onKeyDown={(e)=>{if(e.key==="Enter"){searchProduct()}}}></input>
          
        </div>
        <button
            className="icon"
            onClick={searchProduct}
          >Rechercher
            <PackageSearch /> 
          </button>
      </div>
    </div>
  );
};

export default Home;
