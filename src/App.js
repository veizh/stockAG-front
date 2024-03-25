import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Qr from "./pages/qrcode";
import LoginElement from "./pages/login";
import NavBar from "./components/navBar";
import AddNewProduct from "./pages/Newproduct";
import {AlertTriangle} from "lucide-react"
import { addHeaderJWT } from "./utils/header";
import "./styles/Navbar/navbar.css";
import Bibliotheque from "./pages/Bibliotheque";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "./utils/server";
import Pushingpage from "./pages/pushAll";
import Account from "./pages/account";
export const UserCtx = createContext();
UserCtx.displayName = "userCtx";

function App() {
  let Navigate = useNavigate();
  const [alert,setAlert]=useState(false)
  let [user,setUser] =useState(null)
  function alertfc(msg){
    setAlert(msg)
  }
  
  useEffect(  () => {
    async function verifyJwt(){
      if (localStorage.getItem("JWT")&&!user) {
       await fetch(server + "users/auth", { headers: addHeaderJWT(),method:"POST",body:localStorage.getItem('JWT') })
      .then((res) =>res.ok&& res.json())
      .then(res=> !user&&setUser(res))

      return 
    } 
    if(localStorage.getItem('JWT')){
      return
    }else {
      Navigate("/identification");
      return 
    }
    }
    verifyJwt()
  },[window.location.pathname]);
  return (
    <UserCtx.Provider value={[user,setUser]}>
    <div className="App">
    <div className={alert?"alert__container open":"alert__container"}>
        <div className="text"><AlertTriangle size={50} strokeWidth={1.75}/><p>{alert}</p><AlertTriangle  size={50} strokeWidth={1.75}/></div>
        <button onClick={()=>setAlert(false)}>OK</button>
      </div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home alert={(e)=>alertfc(e)} />} />
        <Route path="/pushall" element={<Pushingpage />} />
        <Route path="/product/:id" element={<Product alert={(e)=>alertfc(e)}/>} />
        <Route path="/qr/:id" element={<Qr />} />
        <Route path="/product/create" element={<AddNewProduct alert={(e)=>alertfc(e)}/>} />
        <Route path="/stock" element={<Bibliotheque alert={(e)=>alertfc(e)}/>} />
        <Route path="/account" element={<Account alert={(e)=>alertfc(e)}/>} />
        <Route path="/identification" element={<LoginElement  alert={(e)=>alertfc(e)}/>} />
      </Routes>
      
    </div>
    </UserCtx.Provider >
  );
}


export default App;
