import { PlusCircle,XCircle } from "lucide-react"
import { useRef, useState } from "react";
import "../styles/createproduct/newproduct.css";
import { addHeaderJWT } from "../utils/header";
import { server } from "../utils/server";
const AddNewProduct = (props) => {
  const [newProduct,setNewProduct] =useState(null)
  const  name = useRef();
  const  dialog = useRef();
  const  form = useRef();
  const reference= useRef();
  const quantity= useRef();
  const min= useRef();
  const max= useRef();
  const location= useRef();
  const maker= useRef();
  let setAlert = props.alert
  function createNewProduct(){
    fetch(server+"products/create", { 
      method:"POST",   headers: {
        "Accept": "*/*",
 "Content-Type": "application/json",
 "authorization": 'bearer ' + localStorage.getItem('JWT')
      },
      body: JSON.stringify(newProduct)
    })
    .then(res=>res.json())
    .then((res)=>{
      res.err && setAlert(res.msg)}
      );
    setNewProduct(null)
  }
  function modalAction(e, key) {
    e.preventDefault();
    switch (key) {
      case "cancel":
        dialog.current.close();
        break;
      case "valider":
        dialog.current.close();
        createNewProduct()
        setNewProduct(null)
        form.current.reset()
        break;
      default:
        break;
    }}
  function submitIsOk(e){
    e.preventDefault();
    if(!name.current.value || !reference.current.value || !quantity.current.value || !min.current.value || !max.current.value || !maker.current.value || !location.current.value){
      setAlert('Il faut remplir tout les champs')
      return
    }else{
      let tmp ={"name":name.current.value,"ref":reference.current.value.toUpperCase(),"quantity":quantity.current.value,"minQuantity":min.current.value,"maxQuantity":max.current.value,"maker":maker.current.value,"location":location.current.value.toUpperCase()}
      setNewProduct(tmp)
      dialog.current.showModal()
      return 
    }

  }
  return (
  <>
    <div className="new__product__component">
    <dialog ref={dialog}>
    <div className="head">
          <p>Creer le produit:</p>
          <XCircle size={35} onClick={(e) => {modalAction(e,"cancel")}} />
        </div>
      <div className="main add">{newProduct?
        <>
        <div className="item"><div className="label">Nom: </div>{newProduct.name}</div>
        <div className="item"><div className="label">Référence: </div>{newProduct.ref}</div>
        <div className="item"><div className="label">Quantité: </div>{newProduct.quantity}</div>
        <div className="item"><div className="label">Min: </div>{newProduct.minQuantity}</div>
        <div className="item"><div className="label">Max: </div>{newProduct.maxQuantity}</div>
        <div className="item"><div className="label">Fournisseur: </div>{newProduct.maker}</div>
        <div className="item"><div className="label">Localisation: </div>{newProduct.location}</div>
       
        </>:""
      }</div>
      <div className="buttons__container two">

      <button onClick={(e)=>{modalAction(e,"cancel")}} className="cancel">Annuler</button>
      <button onClick={(e)=>{modalAction(e,"valider")}} className="validate">Valider</button>
      </div>
    </dialog>
  
      <form ref={form} className="form__component">
        <label htmlFor="name">Nom du Produit:</label>
        <input ref={name} autoComplete="off"  name="name" type="text" />

        <div className="container__inputs">
          <div className="subcontainer">
            <label htmlFor="reference">Référence:</label>
            <input ref={reference} autoComplete="off" name="quantity" type="text" />
          </div>
          <div className="subcontainer">
            <label htmlFor="quantity">Quantité:</label>
            <input ref={quantity} autoComplete="off" name="quantity" type="number" />
          </div>
        </div>
        <div className="container__inputs">
          <div className="subcontainer">
        <label htmlFor="minquantity">Quantité min:</label>
        <input ref={min} autoComplete="off" name="minquantity" type="number" />
        </div>
        <div className="subcontainer">
        <label htmlFor="maxquantity">Quantité max:</label>
        <input ref={max} autoComplete="off" name="maxquantity" type="number" />
</div></div>
        <label htmlFor="maker">Fournisseur:</label>
        <input ref={maker} autoComplete="off" name="maker" type="text" />

        <label htmlFor="location">Localisation:</label>
        <input ref={location} autoComplete="off" name="location" type="text" />

        <button
          onClick={(e) => {
            submitIsOk(e)
          }}
        >
          Créer le produit
          <PlusCircle />
        </button>
      </form>
    </div>
  </>
  );
};
export default AddNewProduct
