import { server } from "../utils/server";

const { data } = require("../utils/data");

const Pushingpage =()=>{

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
        data.forEach(e=>{
            e.alert = false
            e.location = ""
            e.name = e.name.toLocaleLowerCase()
            createNewProduct(e)
        })
        
    }
    return(
        <button style={{margin:150}} onClick={()=>(pushTest())}>push</button>
    )
}
export default Pushingpage