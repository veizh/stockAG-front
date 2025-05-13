import { useState } from "react";
import { createPortal } from "react-dom";

const ModalSelectDiv = ({ options = [], title = "Choisir une option", onSelect, onClose, show }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const handleConfirm = (item) => {
    let tmp = []
    tmp.push(item)
      onSelect(tmp);
      onClose();
      
  };

  if (!show) return null;
 
  return createPortal(  
    <div className="overlay">
      <div className="modal-box">
        <div className="modal-head">
        <h2>{title}</h2>
        <ul>
          {options && options.map((option, index) => (
            <li className="list" key={index} onClick={() => handleConfirm(option)}>
              {+option.contractNumber +" - " +option.clientName + " - " +option.location + " - "+option.codePostal +" - "+option.ville  } 
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalSelectDiv;