
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { usePDF } from 'react-to-pdf';
import { useParams,useNavigate } from "react-router-dom";
import { server } from "../utils/server";
import { addHeaderJWT } from "../utils/header";

const Qr= ()=>{
    let Navigate = useNavigate()
    let {id} = useParams()
    let [product,setProduct]=useState(null)
    useEffect(()=>{
       
        getProduct()
    },[id])
    function getProduct(){

        fetch(server+"products/getOne/"+id,{headers:addHeaderJWT(),method:"GET"}).then(res=>res.json()).then(res=>{
          if(res.error){
            return Navigate('/')
          }
          return setProduct(res)
        })
  
      }
    // ajouter des propriétés pour rendre le tout dynamique et gerer des Qr codes a la volé avec le bon nom de fichier lors des telechargement ainsi que 
    const { toPDF, targetRef } = usePDF({filename: `${product&&product.name}.pdf`});
    return(<div className="qr__container">
    
        <div className="child" ref={targetRef} >
            <div className="text" >Référence: {product&&product.ref}<br/>Localisation: {product&&product.location}</div>
            <QRCode  size={512}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={`https://stock-ag-front.vercel.app/product/${id}`}
    viewBox={`0 0 256 256`} />
        </div>
        <button onClick={() => toPDF()}>Télécharger le QRcode</button>
    </div>
    )
}
export default Qr