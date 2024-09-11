import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import '../styles/addImage/addImage.css'
import { server } from '../utils/server';
import { addHeaderJWT } from '../utils/header';
import { UserCtx } from "../App";

const AddImageToProduct =()=>{
    let CTX = useContext(UserCtx)

    const [image, setImage] = useState(null); // Stocke l'URL de l'image uploadée
    const [file, setFile] = useState(null);   // Stocke le fichier sélectionné
    let [product, setProduct] = useState();
    let { ref } = useParams();
    let cloudName= 'dsbsvzqk1' 
    let keysecret="HMwLQEisOA8HQfVVP09HIz4Q3-s"
    let apiKey="932485328589227"
    const handleImageChange = (e) => {
      setFile(e.target.files[0]); // Capture le fichier image sélectionné
    };
    function getProduct() {
        fetch(server + "products/getOne/" + ref, {
          headers: addHeaderJWT(),
          method: "GET",
        })
          .then((res) => res.json())
          .then((res) => {
            return setProduct(res);
          });
      }
    useEffect(() => {
        getProduct();
      }, []);
      useEffect(()=>{
        console.log('====================================');
        console.log(product);
        console.log('====================================');
      },[product])
  useEffect(()=>{
    if(image){
        AddImageToTheProduct()
    }
    
  },[image])
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'test-stock');  
  
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dsbsvzqk1/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const data = await response.json();
      setImage(data.secure_url); // Stocke l'URL sécurisée de l'image dans le state

    };
    function AddImageToTheProduct(){
        let tmp = product
        tmp.imgUrl= image
        if(CTX[0]&&CTX[0].role==="employe"){
            console.log('====================================');
            console.log("vous n'avez pas les droits de faire ca");
            console.log('====================================');
            return
          }
          fetch(server + "products/updateImage/" + ref, {
            method: "PUT",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              authorization: "bearer " + localStorage.getItem("JWT"),
            },
            body: JSON.stringify(tmp),
          })
            .then((res) =>  res.json())
            .then((res)=>console.log(res))
           
              
    }
    return (
      <div className='addImageComponent'>
        <div className='container'>
            
        <h1>Ajouter une image au produit {ref}</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" className='btn__file' onChange={handleImageChange} />
          
         <button type="submit">Uploader l'image</button>
        </form>
        {image && (
            <div className='container__confirmation'>
            <p>Image uploadée :</p>
            <img src={image} alt="Uploaded" style={{ width: '100%', maxWidth: '500px' }} />
          </div>
        )}
        </div>
      </div>
    );
}
export default AddImageToProduct