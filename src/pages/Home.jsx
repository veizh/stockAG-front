import {  useEffect, useRef, useState } from "react";
import "../styles/home/home.css";
import { Navigate, useNavigate } from "react-router-dom";
import { server } from "../utils/server";
import { addHeaderJWT } from "../utils/header";
import Loading from "../components/loading";
const Home = (props) => {
  let [dataFiltered,setDataFiltered]=useState()
  let setAlert = props.alert
  let refInput = useRef();
  let Navigate= useNavigate()
  let [loading, setLoading] = useState(true);
  let [allProducts, setAllProducts] = useState();
    function navToProduct(ref){
     
        return Navigate("/product/"+ref)
      }

    
    async function getAllProducts() {
      fetch(server + "products/getAll", {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          authorization: "bearer " + localStorage.getItem("JWT"),
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          setAllProducts(res)
         
          setLoading(false)
        });
    }
    useEffect(()=>{
      getAllProducts()
    },[])
   async function filterResult(allProducts){
    let tmp =await  allProducts.filter(e=>{
      if(e.name.toLocaleLowerCase().includes(refInput.current.value.toLocaleLowerCase()) ||e.ref.toLocaleLowerCase().includes(refInput.current.value.toLocaleLowerCase()) ){

        return e
      }
    
    })
    setDataFiltered(tmp)
   }
   if(loading){
    return <Loading />
   }
  return (
    <div className="home__component">
      <div className="input__container">
        <label htmlFor="Id">Trouver un produit :</label>
        <div className="subcontainer">
          <input ref={refInput} onChange={(e)=>{
            if(e.target.value.length>2){
             filterResult(allProducts)}
             else{
              setDataFiltered(null)
             }
            
            }} placeholder="AAAA" type="text" ></input>
          
        </div>
       
      </div>
      {<List data={dataFiltered} />}
      
    </div>
  );
};

const List = (props)=>{
  return(
    <div className="list__container">
      {props.data&&props.data.map((e,i)=> <Product__line data={e} key={i} />)}
    </div>
  )
}
const Product__line=(props)=>{
  let Navigate= useNavigate()

  return(
    <div className="list__item" onClick={()=>Navigate("/product/"+props.data.ref)}>
      <div className="item item__name">{props.data.name&&props.data.name}</div>
      <div className="item item__ref">{props.data.ref&&props.data.ref}</div>
      <div className="item item__location">{props.data.location&&props.data.location}</div>
    </div>
  )
}
export default Home;
