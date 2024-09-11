import React, { useRef, useState } from 'react'
import { Cloudinary } from '@cloudinary/url-gen';


export function CloudinaryUploader() {
    const [image, setImage] = useState(null); // Stocke l'URL de l'image uploadée
    const [file, setFile] = useState(null);   // Stocke le fichier sélectionné
    let cloudName= 'dsbsvzqk1' 
    let keysecret="HMwLQEisOA8HQfVVP09HIz4Q3-s"
    let apiKey="932485328589227"
    const handleImageChange = (e) => {
      setFile(e.target.files[0]); // Capture le fichier image sélectionné
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'test-stock');  // Mettre votre preset Cloudinary
  
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
  
    return (
      <div style={{marginTop:"250px"}}>
        <h1>Uploader une image avec Cloudinary</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleImageChange} />
          <button type="submit">Uploader l'image</button>
        </form>
  
        {image && (
          <div>
            <h2>Image uploadée :</h2>
            <img src={image} alt="Uploaded" style={{ width: '100%', maxWidth: '500px' }} />
          </div>
        )}
      </div>
    );
  }