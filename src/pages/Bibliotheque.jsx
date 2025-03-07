import {  useNavigate } from "react-router-dom";
import "../styles/bibliotheque/bibliotheque.css";
import "../styles/allqr/allqr.css"

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
   XCircle,  Trash2, Ban,CheckCircle2, AlertTriangle,   QrCode,
  BookImage,} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { server } from "../utils/server";
import { addHeaderJWT } from "../utils/header";
import QRCode from "react-qr-code";
import {Margin, usePDF,Resolution } from "react-to-pdf";
import Loading from "../components/loading";
import { UserCtx } from "../App";
import { createRoot } from "react-dom/client"; // ✅ Import corrigé

const PdfGenerator = ({ allProducts }) => {
  const productsPerPage = 40; // Nombre d'items par page

  const generatePDFs = async () => {
    const totalProducts = allProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const start = pageIndex * productsPerPage;
      const end = Math.min(start + productsPerPage, totalProducts);
      const productsBatch = allProducts.slice(start, end);

      if (productsBatch.length === 0) break; // Si plus de produits, on arrête

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210; 
      const pageHeight = 297; 

      // Création du conteneur temporaire
      const tempContainer = document.createElement("div");
      tempContainer.style.width = "800px";
      tempContainer.style.display = "grid";
      tempContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
      tempContainer.style.gap = "10px";
      tempContainer.style.justifyContent = "center";
      tempContainer.style.alignItems = "center";
      tempContainer.style.padding = "20px";
      tempContainer.style.background = "#fff";

      productsBatch.forEach((product) => {
        const item = document.createElement("div");
        item.style.textAlign = "center";
        item.style.fontSize = "12px";

        item.innerHTML = `<div>${product.ref}</div>`;

        const qrDiv = document.createElement("div");
        qrDiv.style.marginTop = "5px";

        createRoot(qrDiv).render(
          <QRCode value={`https://stock-ag-front.vercel.app/product/${product.ref}`} size={120} />
        );

        item.appendChild(qrDiv);
        tempContainer.appendChild(item);
      });

      document.body.appendChild(tempContainer);

      // Attendre un meilleur rendu des QR codes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Capture de l'image
      const canvas = await html2canvas(tempContainer, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, pageWidth - 20, pageHeight - 20);

      document.body.removeChild(tempContainer);

      // Sauvegarde du PDF
      pdf.save(`qrcodes_${pageIndex + 1}.pdf`);
    }
  };

  return (
    <div>
      <button onClick={generatePDFs}>Télécharger les PDFs</button>
    </div>
  );
};



  


const Bibliotheque = (props) => {
  let dialog = useRef();
  let Navigate = useNavigate()
  let ref = useRef();
  let min = useRef();
  let max = useRef();
  let quantity = useRef();
  let annexe = useRef();
  let imgUrl = useRef();
  let location = useRef();
  let name = useRef();
  let pdfRef = useRef()
  let [alphabetically,setAlphabetically]=useState(true)
  let [placeSort,setPlaceSort]=useState(true)
  let [modifyName, setModifyName] = useState(false);
  let [filtrer, setFiltrer] = useState(false);
  let [productData, setProductData] = useState(null);
  let [updatedProduct, setUpdatedProduct] = useState(null);
  let [loading, setLoading] = useState(true);
  let [allProducts, setAllProducts] = useState(null);
  let [toggleModif, setToggleModif] = useState(false);
  let [role,setRole]=useState(false)
  let setAlert = props.alert;
  let CTX = useContext(UserCtx)
  useEffect(() => {
    if (productData) {
      clearInputsValues();
    }
  }, [productData]);
  useEffect(()=>{

    if(CTX[0]){
      setRole(CTX[0].role)
    }
  },[CTX])
  const { toPDF, targetRef } = usePDF({method: "save", filename: `qrcodes.pdf`, resolution:1,
  page: { margin: Margin.SMALL } })
  function updateController() {
    if( isNaN(Number(min.current.value)) || isNaN(Number(max.current.value)) || isNaN(Number(quantity.current.value)) ){
      setAlert("La quantité doit être un nombre")
      return false
    }
    return true;
  }
  function updateProduct() {
    console.log(imgUrl.current.value);
    
    if(CTX[0]&&CTX[0].role==="employe"){
      console.log('====================================');
      console.log("vous n'avez pas les droits de faire ca");
      console.log('====================================');
      return
    }
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
        annexe: annexe.current.value,
        minQuantity: min.current.value,
        maxQuantity: max.current.value,
        location: location.current.value.toUpperCase(),
        imgUrl:imgUrl.current.value
      }),
    })
      .then((res) =>{ 
        if(res.status===201){
          sendEmail({
            _id: productData._id,
            ref: ref.current.value,
            name: name.current.value,
            quantity: quantity.current.value,
            annexe: annexe.current.value,
            minQuantity: min.current.value,
            maxQuantity: max.current.value,
            newQuantity: quantity.current.value,
            location: location.current.value.toUpperCase(),
          })
        }
        
        res.json()})
     
        
      
  }
  function sendEmail(product) {
    fetch(server + "users/mail", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  }
  function clearInputsValues() {
    ref.current.value = ref.current.defaultValue;
    name.current.value = name.current.defaultValue;
    quantity.current.value = quantity.current.defaultValue;
    min.current.value = min.current.defaultValue;
    max.current.value = max.current.defaultValue;
    location.current.value = location.current.defaultValue;
    imgUrl.current.value = imgUrl.current.defaultValue;
    annexe.current.value = annexe.current.defaultValue;
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
  
  function sortAlphabetically(){
    let tmp = allProducts
    let sortedArray = tmp.sort(function(a, b){
        if(a.name.toUpperCase().trim() < b.name.toUpperCase().trim()) { 
          if(alphabetically){
            return -1
          }else 
            return 1
        }
        if(a.name.toUpperCase().trim() > b.name.toUpperCase().trim()) {
          if(alphabetically){
            return 1
          }else 
          return -1
        }
        return 0;
    })
    setAlphabetically(!alphabetically)
    setAllProducts(sortedArray)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 250);
    
  }
  function sortByPlace(){
    let tmp = allProducts
    let sortedArray = tmp.sort(function(a, b){
        if(a.location.toUpperCase().trim() < b.location.toUpperCase().trim()) { 
          if(placeSort){
            return -1
          }else 
            return 1
        }
        if(a.location.toUpperCase().trim() > b.location.toUpperCase().trim()) {
          if(placeSort){
            return 1
          }else 
          return -1
        }
        return 0;
    })
    setPlaceSort(!placeSort)
    setAllProducts(sortedArray)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 250);
    
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
         { role!=="employe"&&<div className="pdf__file" ref={targetRef}>
      {allProducts.map((product, i) => {
        return (
          <div className="child" key={i} >
            <div className="text" ><br/>Référence: {product&&product.ref}</div>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`https://stock-ag-front.vercel.app/product/${product.ref}`}
              viewBox={`0 0 256 256`}
            />
          </div>
        )
      })}
    </div>}
        <dialog className="modal" autoFocus ref={dialog}>
          <div className="head">
            <div className="container midfy">
              
              <div className="namep">
                <p className="namepe">{productData && productData.name}</p><p className="qr" onClick={()=>Navigate(productData &&"/qr/"+productData.ref)}><QrCode size={27} stroke="#ed6e0b" /></p>
              </div>
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
              <label htmlFor="name">nom du produit : </label>
              <input
                className={ "open" }
                ref={name}
                type="text"
                defaultValue={productData && productData.name}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">réference : </label>
              <input
                ref={ref}
                type="text"
                defaultValue={productData ? productData.ref : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité : </label>
              <input
                ref={quantity}
                type="text"
                defaultValue={productData ? productData.quantity : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité Min : </label>
              <input
                ref={min}
                type="text"
                defaultValue={productData ? productData.minQuantity : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité Max : </label>
              <input
                ref={max}
                type="text"
                defaultValue={productData ? productData.maxQuantity : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Localisation : </label>
              <input
                ref={location}
                type="text"
                defaultValue={productData ? productData.location : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="annexe">Champ Annexe : </label>
              <input
                ref={annexe}
                type="text"
                defaultValue={productData ? productData.annexe : null}
              />
            </div>
            <div className="container__input">
              <label htmlFor="imgUrl">Url de l'image : </label>
              <input
                ref={imgUrl}
                type="text"
                defaultValue={productData ? productData.imgUrl&&productData.imgUrl : null}
              />
            </div>
            <div className="container__input">
             <button className="addImage" onClick={()=>{Navigate(`../addImage/${productData&&productData.ref}`)}}><p>Ajouter une image</p><BookImage /></button>
            </div>
          </div>
          <div className="buttons__container">
            <button className="delete"
              onClick={(e) => {
                modalAction(e, "delete");
              }}
            >
              Supprimer <Trash2  strokeWidth={1.4} />
            </button>
            <button 
              onClick={(e) => {
                modalAction(e, "cancel");
              }}
            >
              Annuler <Ban />
            </button>
            <button
            className="validate"
              onClick={(e) => {
                modalAction(e, "update");
              }}
            >
              Valider <CheckCircle2 />
            </button>
          </div>
        </dialog>
        <div className="blibliotheque__component">
          <div className="action__container">

         {<button className="qr__codes" onClick={()=>{setFiltrer(!filtrer)}} > {!filtrer?"Voir les produits manquants":"Voir tout les produits "}</button>}
         {role!=="employe"&&<PdfGenerator allProducts={allProducts}/>}
         <button className="qr__codes" onClick={()=>{setToggleModif(true)}}>Rafraichir</button>
          </div>
          <table>
            <thead>
              <tr>
                <th scope="col" className="name" onClick={()=>{sortAlphabetically()}}>
                  Produit
                </th>
                <th scope="col">Réf</th>
                <th scope="col" className="name" onClick={()=>{sortByPlace()}}>Lieu</th>
                <th scope="col">Qté</th>
              </tr>
            </thead>
            <tbody>
              {allProducts &&
                allProducts.map((element, i) => {
                  if(filtrer && element.alert){
                    return (
                      <tr key={i} >
                        <th scope="row" onClick={ ()=>{
                          if(role==="employe")return

                          setProductData(element);
                          dialog.current.showModal()}} className="name">
                          {element.name}
                        </th>
                        <td>{element.ref}</td>
                        <td className="location">{element.location}</td>
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
                      
                      </tr>
                    );
                  }
                  else{
                    return <tr key={i} className={filtrer?"invisible":"visible"}>
                    <th scope="row" onClick={ ()=>{
                      if(role==="employe")return
                      setProductData(element);
                          dialog.current.showModal()}} className="name">
                      {element.name}
                    </th>
                    <td>{element.ref}</td>
                    <td className="location">{element.location}</td>
                    <td
                      className={
                        Number(element.minQuantity) >
                          Number(element.quantity) 
                          ? "alert qt"
                          : "qt"
                      }
                    >
                      {element.quantity}
                    </td>
                  
                  
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
