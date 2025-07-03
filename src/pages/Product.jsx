import { useEffect, useRef, useState, useContext } from "react";
import "../styles/product/product.css";
import { Ban, CheckCircle2, XCircle, AlertTriangleIcon, PackageMinusIcon,PackagePlusIcon, ListOrdered, ListMinus, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../utils/server";
import { addHeaderJWT } from "../utils/header";
import { UserCtx } from "../App";
import ModalSelectDiv from "../components/modalSelect";
const Product = (props) => {
  let { _id } = useParams();
  let [product, setProduct] = useState();
  let [quantity, setQuantity] = useState(0);
  const user = useContext(UserCtx)[0];
  let dialogRemove = useRef();
  let dialogtransfert = useRef();
  let dialogAdd = useRef();
  let [allSites,setAllsites]= useState()
  let[dialogTransfertVisible,setDialogTransfertVisible] =useState(false)
  const [isModalVisible, setModalVisible] = useState(false);  // Gestion de la modale
  const [selectedSite, setSelectedSite] = useState(null);
  let Navigate = useNavigate();
  let setAlert = props.alert;
  useEffect(()=>{
console.log(dialogTransfertVisible);

  },[dialogTransfertVisible])
  function getProduct() {
    fetch(server + "products/getOne/" + _id, {
      headers: addHeaderJWT(),
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return Navigate("/");
        }
        return setProduct(res);
      });
  }
  useEffect(() => {
    getProduct();
    siteAvaible()
  }, []);
  function addProductAndHandleAlert(){
    console.log('add');
    
    fetch(server + "products/addProductAndHandleAlert/" + _id, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        authorization: "bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({ quantity: quantity }),
    }).then((res) => {
      if(res.status === 201){
        sendEmail();

      }
      if (res.status === 207) {
        dialogAdd.current.close();
        dialogRemove.current.close();

        setAlert(
          "Vous ne pouvez retirer plus de produits qu'il n'y en a en stock."
        );
      } else {
        setTimeout(() => {
          if (user.role === "admin") {
            Navigate("/stock");
          } else {
            Navigate("/");
          }
        }, 500);
      }
    });
  }
  function removeProductAndHandleAlert(){
    console.log('add');
    
    fetch(server + "products/removeProductAndHandleAlert/" + _id, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        authorization: "bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({ quantity: quantity }),
    }).then((res) => {
      if(res.status === 201){
        sendEmail();

      }
      if (res.status === 207) {
        dialogAdd.current.close();
        dialogRemove.current.close();

        setAlert(
          "Vous ne pouvez retirer plus de produits qu'il n'y en a en stock."
        );
      } else {
        setTimeout(() => {
          if (user.role === "admin") {
            Navigate("/stock");
          } else {
            Navigate("/");
          }
        }, 500);
      }
    });
  }
  function siteAvaible(){
    fetch("https://back-material-ag.vercel.app/interventions/getAllInterventions",{
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json"
      },
      method: "GET"
  })  .then((res) => res.json())
  .then((res) => {
    let table= []
    res?.map(e=>{
      if(e.state!=="Terminé"){
        table.push(e)
      }
    })
     setAllsites(table)
     
  });
  }
  function updateQuantityAndAlert() {
    console.log("update");
    
    fetch(server + "products/updateQuantityAndAlert/" + _id, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        authorization: "bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({ quantity: quantity }),
    }).then((res) => {
      if (res.status === 207) {
        dialogAdd.current.close();
        dialogRemove.current.close();

        setAlert(
          "Vous ne pouvez retirer plus de produits qu'il n'y en a en stock."
        );
      } else {
        setTimeout(() => {
          if (user.role === "admin") {
            Navigate("/stock");
          } else {
            Navigate("/");
          }
        }, 500);
      }
    });
  }
  function SendOnSite() {
    if(!selectedSite) return
    if(!quantity) return
    console.log("update");
    let match = false
    
    let index = null
    let updatedIntervention = selectedSite[0]
    selectedSite[0].materials.forEach((e,i) => {
    
 if(e._id===_id){
      match = true
      index=i
    }
 
    } )
    if(match){

      console.log(updatedIntervention.materials[index]);
      
    updatedIntervention.materials[index].quantity=Number(updatedIntervention.materials[index].quantity)+Number(quantity)
  }else{
    let item = {name:product.name,quantity:quantity,ref:product.ref}
    item.quantity=quantity
    updatedIntervention.materials.push(item)
  }
   fetch('https://back-material-ag.vercel.app/interventions/updateIntervention/'+updatedIntervention._id,{
     method: "PUT",
     headers: {
       Accept: "*/*",
       "Content-Type": "application/json",
     },
     body:JSON.stringify(updatedIntervention)
    
    }).then(res=>res.json())
   fetch(server + "products/updateQuantityAndAlert/" + _id, {
     method: "PUT",
     headers: {
       Accept: "*/*",
       "Content-Type": "application/json",
       authorization: "bearer " + localStorage.getItem("JWT"),
     },
     body: JSON.stringify({ quantity: Number(product.quantity)-Number(quantity) }),
   }).then((res) => {
     if (res.status === 207) {
       dialogAdd.current.close();
       dialogRemove.current.close();

       setAlert(
         "Vous ne pouvez retirer plus de produits qu'il n'y en a en stock."
       );
     } else {
       setTimeout(() => {
         if (user.role === "admin") {
           Navigate("/");
         } else {
           Navigate("/");
         }
       }, 200);
     }
   });
  }
  function sendEmail() {
    fetch(server + "users/mail", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  }
  function modalAction(e, key) {
    e.preventDefault();
    switch (key) {
      case "cancel":
        
      dialogAdd.current.close();
      dialogRemove.current.close();
        break;
      case "update":
        product.newQuantity = quantity;

        updateQuantityAndAlert();
        break
      case "sendOnSite":
          product.newQuantity = quantity;
  
          SendOnSite();
          break
      case "add":
          product.newQuantity = Number(product.quantity)+Number(quantity);
  
          addProductAndHandleAlert();
          break
      case "remove":
          product.newQuantity = Number(product.quantity)-Number(quantity);

          removeProductAndHandleAlert()
          break
      default:
        break;
    }
  }

  return (
    <>
      <ModalSelectDiv
        show={isModalVisible}  // Contrôle de l'affichage
        title="Sélectionner un site"
        options={allSites}
        onSelect={setSelectedSite}
        onClose={() => setModalVisible(false)}  // Ferme la modale
      />
    <dialog className="modal product add" autoFocus ref={dialogAdd}>
    <div className="head">
      <p>Ajout de produits </p>
      <XCircle
        size={35}
        onClick={(e) => {
          modalAction(e, "cancel");
        }}
      />
    </div>
    <div className="main">
      <div className="container__input">
        <label htmlFor="name">Combien d'exemplaires ajoutez-vous ? </label>
        <input
          onChange={(e) => {
            setQuantity(e.target.value);
          }}
          type="number"
          placeholder={0}
          min={1}
          max={product && product.quantity}
        />
      </div>
    </div>
    <div className="buttons__container">
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
          modalAction(e, "add");
        }}
      >
       <PackagePlusIcon strokeWidth={1.8}  /> Ajouter  <PackagePlusIcon strokeWidth={1.8}  />
      </button>
    </div>
  </dialog>

  {dialogTransfertVisible&&<div className="modal  exception product "  autoFocus ref={dialogtransfert}>
    <div className="head">
      <p>Envoyer des produits en intervention </p>
      <XCircle
        size={35}
        onClick={() => {
          
          setDialogTransfertVisible(null)

        }}
      />
    </div>
    <div className="main">
      <div className="container__input">
        <button onClick={() => setModalVisible(true)}><p>{selectedSite?selectedSite[0].clientName:"Choisissez un site"}</p><ChevronRight size={25} /></button>
        <label htmlFor="name">Combien d'exemplaires emmenez-vous ? </label>
        <input
          onChange={(e) => {
            setQuantity(e.target.value);
          }}
          type="number"
          placeholder={0}
          min={1}
          max={product && product.quantity}
        />
      </div>
    </div>
    <div className="buttons__container">
      <button
        onClick={(e) => {
          setDialogTransfertVisible(false)


        }}
      >
        Annuler <Ban />
      </button>
      
      <button
      className="transfert validate "
        onClick={(e) => {
          modalAction(e, "sendOnSite");
          setDialogTransfertVisible(false)

        }}
      >
       <PackagePlusIcon strokeWidth={1.8}  /> Envoyer  <PackagePlusIcon strokeWidth={1.8}  />
      </button>
    </div>
  </div>
      }

      <dialog className="modal product remove" autoFocus ref={dialogRemove}>
        <div className="head">
          <p>Retrait de produits</p>
          <XCircle
            size={35}
            onClick={(e) => {
              modalAction(e, "cancel");
            }}
          />
        </div>
        <div className="main">
          <div className="container__input">
            <label htmlFor="name">Combien d'exemplaires retirez-vous ? </label>
            <input
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              type="number"
              placeholder={0}
              min={1}
              max={product && product.quantity}
            />
          </div>
        </div>
        <div className="buttons__container">
          <button
            onClick={(e) => {
              modalAction(e, "cancel");
            }}
          >
            Annuler <Ban />
          </button>
          <button
          className="delete"
            onClick={(e) => {
              modalAction(e, "remove");
            }}
          >
            Retirer <PackageMinusIcon strokeWidth={1.8}  />
          </button>
        </div>
      </dialog>
      <div className="product__component">
        <div className="product__card">
          <div className="product__item name">{product && product.name}</div>
          {product&&product.imgUrl&&<div>
            <img src={product.imgUrl} alt="Image du produit"  />
          </div>}
          <div className="product__item">
            <span>Localisation:</span> {product && product.location}
          </div>
          <div className="product__item">
            <span>Référence:</span> {product && product.ref}
          </div>
          <div className="product__item">
            <span>Quantité:</span> {product && product.quantity}
          </div>
          <div className="buttons__container">
            <button
            className="remove"
              onClick={() => {
                dialogRemove.current.showModal();
              }}
            ><p><PackageMinusIcon strokeWidth={1.8} size={30} />Retrait<PackageMinusIcon strokeWidth={1.8} size={20} /></p>
            </button>
            <button
            className="transfert"
              onClick={() => {
                
                setDialogTransfertVisible(true)
              }}
              
            ><p>Envoyer sur site</p>
            </button>
            <button
            className="add"
              onClick={() => {
                dialogAdd.current.showModal();
              }}
              
            ><p><PackagePlusIcon strokeWidth={1.8} size={30} />Ajout<PackagePlusIcon strokeWidth={1.8} size={20} /></p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Product;
