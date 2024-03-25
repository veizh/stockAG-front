import { Link } from "react-router-dom";
import "../styles/bibliotheque/bibliotheque.css";
import "../styles/allqr/allqr.css"
import {
  Settings, XCircle,  Trash2, Ban,CheckCircle2, Pencil,AlertTriangle, PackageMinusIcon, PackageCheckIcon,} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { server } from "../utils/server";
import { addHeaderJWT } from "../utils/header";
import QRCode from "react-qr-code";
import {Margin, usePDF,Resolution } from "react-to-pdf";
import Loading from "../components/loading";
const Bibliotheque = (props) => {
  let dialog = useRef();
  let ref = useRef();
  let min = useRef();
  let max = useRef();
  let quantity = useRef();
  let location = useRef();
  let name = useRef();
  let pdfRef = useRef()
  let [modifyName, setModifyName] = useState(false);
  let [filtrer, setFiltrer] = useState(false);
  let [productData, setProductData] = useState(null);
  let [updatedProduct, setUpdatedProduct] = useState(null);
  let [loading, setLoading] = useState(true);
  let [allProducts, setAllProducts] = useState(null);
  let [toggleModif, setToggleModif] = useState(false);
  let setAlert = props.alert;
  useEffect(() => {
    if (productData) {
      clearInputsValues();
    }
 
  }, [productData]);
  const { toPDF, targetRef } = usePDF({method: "save", filename: `qrcodes.pdf`,resolution:Resolution.LOW,
  page: { margin: Margin.SMALL } })
  function updateController() {
    console.log(typeof Number(min.current.value))
    console.log(Number(min.current.value));
    if( isNaN(Number(min.current.value)) || isNaN(Number(max.current.value)) || isNaN(Number(quantity.current.value)) ){
      setAlert("La quantité doit être un nombre")
      return false
    }
    return true;
  }
  function updateProduct() {
    fetch(server + "products/updateOne/" + productData.ref, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        authorization: "bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({
        _id: productData._id,
        ref: ref.current.value,
        name: name.current.value,
        quantity: quantity.current.value,
        minQuantity: min.current.value,
        maxQuantity: max.current.value,
        location: location.current.value.toUpperCase(),
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
     
        
        setToggleModif(true);
      
  }
  function clearInputsValues() {
    ref.current.value = ref.current.defaultValue;
    name.current.value = name.current.defaultValue;
    quantity.current.value = quantity.current.defaultValue;
    min.current.value = min.current.defaultValue;
    max.current.value = max.current.defaultValue;
    location.current.value = location.current.defaultValue;
  }
  function deleteProduct() {
    fetch(server + "products/deleteOne/" + productData.ref, {
      method: "delete",
      headers: addHeaderJWT(),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
        setToggleModif(true);
     
  }
  function modalAction(e, key) {
    e.preventDefault();
    switch (key) {
      case "cancel":
        dialog.current.close();
        setUpdatedProduct(null);
        break;
      case "update":
        if (updateController()) {
          updateProduct();

          dialog.current.close();
        }
        dialog.current.close();

        break;
      case "delete":
        deleteProduct();
        dialog.current.close();

        break;
      default:
        break;
    }
  }
  async function modifyAlert(element){
   fetch(server+"products/updateOne/" + element.ref,{
     method: "PUT",
     headers: {
       Accept: "*/*",
       "Content-Type": "application/json",
       authorization: "bearer " + localStorage.getItem("JWT"),
     },
     body: JSON.stringify({
       _id: element._id,
       ref:element.ref,
       name: element.name,
       quantity: element.quantity,
       minQuantity: element.minQuantity,
       maxQuantity: element.maxQuantity,
       location: element.location.toUpperCase(),
        alert:false,
     }),
   })
   .then((res) => res.json())
   .then((res) => console.log(res));
   setToggleModif(true);
  }
  //fetch toutes les references
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
  

  useEffect(() => {
    setLoading(true)
    getAllProducts();
    setToggleModif(false);
  }, [toggleModif]);
  if(loading){
    return(
      <Loading />
    )
  }
  else if (
    !Array.isArray(allProducts) ||
    (!loading && allProducts.length === 0)
  ) {
    return (
      <>
        <div className="blibliotheque__component text__alert">
          <div className="content">
            {" "}
            <AlertTriangle size={40} />
            <div className="text">
              Il n'y pas de produit en stock pour le moment !
            </div>
            <AlertTriangle size={40} />
          </div>
        </div>
      </>
    );
  }
  else{


    return (
      <>
          <div className="pdf__file" ref={targetRef}>
      {allProducts.map((product, i) => {
        return (
          <div className="child" key={i} >
            <div className="text">
              Référence: {product && product.ref}
              <br />
              Localisation: {product && product.location}
            </div>
            <QRCode
              size={512}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`https://stock-ag-front.vercel.app/product/${product.ref}`}
              viewBox={`0 0 256 256`}
            />
          </div>
        )
      })}
    </div>
        <dialog className="modal" autoFocus ref={dialog}>
          <div className="head">
            <div className="container">
              <input
                className={modifyName ? "open" : ""}
                ref={name}
                type="text"
                readOnly={modifyName ? false : true}
                defaultValue={productData && productData.name}
              />
              {!modifyName && (
                <Pencil
                  onClick={() => {
                    setModifyName(!modifyName);
                  }}
                />
              )}
            </div>
            <XCircle
              size={35}
              onClick={(e) => {
                modalAction(e, "cancel");
              }}
            />
          </div>
          <div className="main">

            <div className="container__input">
              <label htmlFor="name">réference: </label>
              <input
                ref={ref}
                type="text"
                defaultValue={productData ? productData.ref : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité: </label>
              <input
                ref={quantity}
                type="text"
                defaultValue={productData ? productData.quantity : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité Min: </label>
              <input
                ref={min}
                type="text"
                defaultValue={productData ? productData.minQuantity : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité Max: </label>
              <input
                ref={max}
                type="text"
                defaultValue={productData ? productData.maxQuantity : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Localisation: </label>
              <input
                ref={location}
                type="text"
                defaultValue={productData ? productData.location : null}
              />
            </div>
          </div>
          <div className="buttons__container">
            <button
              onClick={(e) => {
                modalAction(e, "delete");
              }}
            >
              Supprimer <Trash2 strokeWidth={1.4} />
            </button>
            <button
              onClick={(e) => {
                modalAction(e, "cancel");
              }}
            >
              Annuler <Ban />
            </button>
            <button
              onClick={(e) => {
                modalAction(e, "update");
              }}
            >
              Valider <CheckCircle2 />
            </button>
          </div>
        </dialog>
        <div className="blibliotheque__component">
         <button className="qr__codes" onClick={()=>{setFiltrer(!filtrer)}} > {!filtrer?"Voir les produits manquants":"Voir tout les produits "}</button>
         <button className="qr__codes" onClick={toPDF}>Télécharger tout les QR codes.</button>

          <table>
            <thead>
              <tr>
                <th scope="col" className="name">
                  Produit
                </th>
                <th scope="col">Réf</th>
                <th scope="col">Lieu</th>
                <th scope="col">Qté</th>
                <th scope="col">Etat</th>
              </tr>
            </thead>
            <tbody>
              {allProducts &&
                allProducts.map((element, i) => {
                  if(filtrer && element.alert){
                    return (
                      <tr key={i} >
                        <th scope="row" onClick={ ()=>{setProductData(element);
                          dialog.current.showModal()}} className="name">
                          {element.name}
                        </th>
                        <td>{element.ref}</td>
                        <td>480</td>
                        <td
                          className={
                            Number(element.minQuantity) >
                              Number(element.quantity) ||
                            Number(element.quantity) > Number(element.maxQuantity)
                              ? "alert qt"
                              : "qt"
                          }
                        >
                          {element.quantity}
                        </td>
                        <td>{<PackageMinusIcon stroke="#b33729" size={17} onClick={()=>modifyAlert(element)} />}</td>
                      
                      </tr>
                    );
                  }
                  else{
                    return <tr key={i} className={filtrer?"invisible":"visible"}>
                    <th scope="row" onClick={ ()=>{setProductData(element);
                          dialog.current.showModal()}} className="name">
                      {element.name}
                    </th>
                    <td>{element.ref}</td>
                    <td>480</td>
                    <td
                      className={
                        Number(element.minQuantity) >
                          Number(element.quantity) ||
                        Number(element.quantity) > Number(element.maxQuantity)
                          ? "alert qt"
                          : "qt"
                      }
                    >
                      {element.quantity}
                    </td>
                    <td>{element.alert?<PackageMinusIcon size={17} onClick={()=>modifyAlert(element)} stroke="#b33729" />:<PackageCheckIcon size={17}  stroke="#40b329" />}</td>
                  
                  
                  </tr>
                  }
                 
                })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
};

export default Bibliotheque
