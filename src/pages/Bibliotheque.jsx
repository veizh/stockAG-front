import { Link } from "react-router-dom";
import "../styles/bibliotheque/bibliotheque.css";
import {
  Settings, XCircle,  Trash2, Ban,CheckCircle2, Pencil,AlertTriangle,} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { server } from "../utils/server";
import { addHeaderJWT } from "../utils/header";
const Bibliotheque = (props) => {
  let dialog = useRef();
  let ref = useRef();
  let maker = useRef();
  let min = useRef();
  let max = useRef();
  let quantity = useRef();
  let location = useRef();
  let name = useRef();
  let [modifyName, setModifyName] = useState(false);
  let [productData, setProductData] = useState(null);
  let [updatedProduct, setUpdatedProduct] = useState(null);
  let [allProducts, setAllProducts] = useState(null);
  let [toggleModif, setToggleModif] = useState(false);
  let setAlert = props.alert;
  useEffect(() => {
    if (productData) {
      clearInputsValues();
    }
  }, [productData]);

  function updateController() {
    if (
      maker.current.value === "" ||
      location.current.value === "" ||
      !quantity.current.value ||
      !min.current.value ||
      !max.current.value ||
      name.current.value === "" ||
      ref.current.value === ""
    ) {
      ref.current.value = ref.current.defaultValue;
      name.current.value = name.current.defaultValue;
      quantity.current.value = quantity.current.defaultValue;
      min.current.value = min.current.defaultValue;
      max.current.value = max.current.defaultValue;
      location.current.value = location.current.defaultValue;
      maker.current.value = maker.current.defaultValue;
      return setAlert(
        "Tout les champs doivent être remplies pour effectuer un changement !"
      );
    } else return true;
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
        ref: ref.current.value.toUpperCase(),
        name: name.current.value,
        quantity: quantity.current.value,
        minQuantity: min.current.value,
        maxQuantity: max.current.value,
        location: location.current.value.toUpperCase(),
        maker: maker.current.value,
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
    maker.current.value = maker.current.defaultValue;
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
      .then((res) => setAllProducts(res));
  }
  useEffect(() => {
    getAllProducts();
    setToggleModif(false);
  }, [toggleModif]);

  if (
    !Array.isArray(allProducts) ||
    (allProducts && allProducts.length === 0)
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
  } else
    return (
      <>
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
                defaultValue={productData ? productData.ref : ""}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité: </label>
              <input
                ref={quantity}
                type="text"
                defaultValue={productData ? productData.quantity : ""}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité Min: </label>
              <input
                ref={min}
                type="text"
                defaultValue={productData ? productData.minQuantity : ""}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Quantité Max: </label>
              <input
                ref={max}
                type="text"
                defaultValue={productData ? productData.maxQuantity : ""}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Localisation: </label>
              <input
                ref={location}
                type="text"
                defaultValue={productData ? productData.location : ""}
              />
            </div>
            <div className="container__input">
              <label htmlFor="name">Fournisseur: </label>
              <input
                ref={maker}
                type="text"
                defaultValue={productData ? productData.maker : ""}
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
          <table>
            <thead>
              <tr>
                <th scope="col" className="name">
                  Produit
                </th>
                <th scope="col">Réference</th>
                <th scope="col">Lieu</th>
                <th scope="col">Quantité</th>
                <th scope="col">Fournisseur</th>
                <th scope="col">QR code</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {allProducts &&
                allProducts.map((element, i) => {
                  return (
                    <tr key={i}>
                      <th scope="row" className="name">
                        {element.name}
                      </th>
                      <td>{element.ref}</td>
                      <td>{element.location}</td>
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
                        <br />
                        <span>min: {element.minQuantity}</span> <br />
                        <span>max: {element.maxQuantity}</span>
                      </td>
                      <td>{element.maker}</td>
                      <td>
                        <Link to={`/qr/${element.ref}`}>Lien</Link>
                      </td>
                      <td>
                        <Settings
                          size={25}
                          strokeWidth={1.5}
                          onClick={() => {
                            setProductData(element);
                            dialog.current.showModal();
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </>
    );
};

export default Bibliotheque;
