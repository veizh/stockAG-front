import { useRef } from "react";
import { server } from "../utils/server";

const { data } = require("../utils/data");

const Pushingpage =()=>{
    let dataref = useRef()
    function createNewProduct(newProduct){
        fetch(server+"products/create", { 
          method:"POST",   headers: {
            "Accept": "*/*",
     "Content-Type": "application/json",
     "Authorization": 'Bearer ' + localStorage.getItem('JWT')
          },
          body: JSON.stringify(newProduct)
        })
        .then(res=>res.json())
        .then((res)=>{
          res.err? console.log("fail"):console.log("success")}
          );
      }
    async function pushTest(){
      console.log('====================================');
      let tmp = JSON.parse(dataref.current.value)
      console.log('====================================');
        tmp.forEach(e=>{
            e.alert = false
            e.location = null
            e.ref=null
            e.name = e.name.toLocaleLowerCase()
            console.log('====================================');
            console.log(e);
            console.log('====================================');
            createNewProduct(e)
        })
        
    }
    return(
      <>
      
      <input ref={dataref} type="test"></input>
      <button style={{margin:150}} onClick={()=>(pushTest())}>Ajouter les produits</button>
      </>
    )
}
export default Pushingpage