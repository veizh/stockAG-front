import { useEffect, useRef, useState, useContext } from "react";
import "../styles/product/product.css";
import { Ban, CheckCircle2, XCircle, AlertTriangleIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../utils/server";
import { addHeaderJWT } from "../utils/header";
import { UserCtx } from "../App";
const Product = (props) => {
  let { id } = useParams();
  let [product, setProduct] = useState();
  let [quantity, setQuantity] = useState(0);
  const user = useContext(UserCtx)[0];
  let dialog = useRef();
  let Navigate = useNavigate();
  let setAlert = props.alert;
  function getProduct() {
    fetch(server + "products/getOne/" + id, {
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
  }, []);
  function updateQuantityAndAlert() {
    fetch(server + "products/updateQuantityAndAlert/" + id, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        authorization: "bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({ quantity: quantity }),
    }).then((res) => {
      if (res.status === 207) {
        dialog.current.close();

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
        dialog.current.close();
        break;
      case "update":
        product.newQuantity = quantity;

        updateQuantityAndAlert();
        sendEmail();

        // add a function to update from teh back

        break;
      default:
        break;
    }
  }

  return (
    <>
      <dialog className="modal product" autoFocus ref={dialog}>
        <div className="head">
          <p>Alerte Rupture </p>
          <XCircle
            size={35}
            onClick={(e) => {
              modalAction(e, "cancel");
            }}
          />
        </div>
        <div className="main">
          <div className="container__input">
            <label htmlFor="name">Combien d'exemplaires reste t'il ? </label>
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
            onClick={(e) => {
              modalAction(e, "update");
            }}
          >
            Signaler la Rupture <CheckCircle2 />
          </button>
        </div>
      </dialog>
      <div className="product__component">
        <div className="product__card">
          <div className="product__item name">{product && product.name}</div>
          <div className="product__item">
            <span>Localisation:</span> {product && product.location}
          </div>
          <div className="product__item">
            <span>Référence:</span> {product && product.ref}
          </div>
          <div className="buttons__container">
            <button
              onClick={() => {
                dialog.current.showModal();
              }}
            >
              Signaler <AlertTriangleIcon strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Product;
