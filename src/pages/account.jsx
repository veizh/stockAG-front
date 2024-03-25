import { useEffect, useState ,useRef, useContext} from "react"
import { addHeaderJWT } from "../utils/header"
import { server } from "../utils/server"
import "../styles/account/account.css"

import { UserRoundPlus, XCircle } from "lucide-react"
import { UserCtx } from "../App"
const Account =(props)=>{
    let context = useContext(UserCtx)
    const [toggleModif,setToggleModif]=useState(false)
    const [accList,setAccList]=useState()
    const [creating,setCreating]=useState(false)
    const [dataCrt,setDataCrt]=useState(null)
    const [newUserData,setNewUserData]= useState(null)
    const dialogRef = useRef()
    const dialogCreate = useRef()
    const name = useRef()
    let setAlert = props.alert
useEffect(()=>{
    fetch(server+"users/getAllUsers",{headers:addHeaderJWT(),method:"GET"}).then(res=>res.json()).then(res=>{setAccList(res)})
    
},[toggleModif])
async function modifyOneAcc(){
    
    let tmp = {
        _id:dataCrt._id,
        mail:name.current.value!==""?name.current.value:dataCrt.mail,
        role:getRole()
    }
        
      fetch(server+"users/modifyOneUser",{
        method:"PUT",  
        headers: {
          "Accept": "*/*",
   "Content-Type": "application/json",
   "authorization": 'bearer ' + localStorage.getItem('JWT')
        },
      body: JSON.stringify(tmp)
      }).then(res=>res.json()).then(res=>setAlert(res.msg))
   dialogRef.current.close()
   setTimeout(() => {
    
       setToggleModif(toggleModif+1)
   }, (500));
}
function deleteOne(){
    fetch(server+"users/deleteOne/"+dataCrt._id,{
        method: "delete",
        headers: addHeaderJWT(),
      })
      dialogRef.current.close()
   setTimeout(() => {
    
       setToggleModif(toggleModif+1)
   }, (500));

}
function getRole(){
   const role =  document.querySelector('.active.btn')
    return role.innerHTML
}
function toggleRole(e){
    document.querySelectorAll('.btn').forEach(x=>x.classList.remove("active"))
    e.target.classList.add("active")
}

    return(
        <>
        <DialogCreate setToggleModif={setToggleModif} setAlert={props.alert} dialogCreate={dialogCreate}  />
        <dialog autoFocus className="dialog__modify__user"  ref={dialogRef}>
            <div className="head center"><p>{dataCrt&&dataCrt.mail}</p><XCircle
              size={35}
              onClick={(e) => {dialogRef.current.close()
              }}
            /></div>
            <div className="main column">

            <label  >Changer le nom du compte :</label>
            <input onChange={()=>setNewUserData({name:name.current.value})} name="a" ref={name} type="text"  autoComplete="hidden" placeholder="Nouveau nom"  />
            <label  >Changer le role du compte :</label>
            
             <div className="role__container">
                <div onClick={(e)=>toggleRole(e)}className={dataCrt&&dataCrt.role==="admin"?"active btn":"btn"}>admin</div>
                <div onClick={(e)=>toggleRole(e)} className={dataCrt&&dataCrt.role==="employe"?"active btn":"btn"}>employe</div>
            </div>
            </div>
            <div className="buttons__container">

            <button onClick={()=>deleteOne()}>Delete</button>
            <button onClick={()=>{
                modifyOneAcc()}}>Modifier</button>
            </div>
        </dialog>
        <div className="acconts__container">
            <button onClick={()=>{dialogCreate.current.showModal();setToggleModif(0)}} className="create" ><UserRoundPlus /> Ajouter un nouveau compte <UserRoundPlus /></button>
                <div className="row_acc entete">
                    <div className="col oranged">Nom de comptes</div>
                    <div className="col oranged">Role</div>
                </div>
        {accList&&accList.map((e,i)=>{
        if(context[0].mail&&context[0].mail===e.mail)return
       return( <div key={i} className="row_acc" onClick={()=>{
            setDataCrt(e)
                
                dialogRef.current.showModal()
            }}>
                <div className="col">{e.mail}</div>
                <div className="col">{e.role}</div>
                </div>)})}
        </div>
            </>
    )
}
const DialogCreate=(props)=>{
    const newUser= {}
    let name = useRef()
    let password = useRef()
    let role = useRef()
    let setAlert = props.setAlert
    function createAcc(){
        fetch(server+"users/create", { 
            method:"POST",   headers: {
              "Accept": "*/*",
       "Content-Type": "application/json",
       "Authorization": 'Bearer ' + localStorage.getItem('JWT')
            },
            body: JSON.stringify(newUser)
          })
          .then(res=>res.json())
          .then((res)=>{setAlert(res.msg)} );
        }
    function toggleRole(e){
        document.querySelectorAll('.btn').forEach(x=>x.classList.remove("active"))
        e.target.classList.add("active")
    }
    function verifyForm(){
        let tmp =<>Le compte n'a pas été créer.<br/>Il faut remplir tout les champs et sélectionner un role</>
        if(!document.querySelector('.btn.active') || !password.current.value ||!name.current.value  ){
            props.dialogCreate.current.close()
            setAlert(tmp)
        } 
        else{
            newUser.mail=name.current.value
            newUser.password=password.current.value
            newUser.role=document.querySelector('.btn.active').innerHTML
            createAcc()
            setTimeout(() => {
                props.setToggleModif(1)
                
            }, 250);
            props.dialogCreate.current.close()

        }
    }
    return(
        <dialog className="dialog__create__user" ref={props.dialogCreate} >
            <div className="head">
                <div className="center">
                    Ajoutez un nouveau compte
        
                </div>
                <XCircle
              size={35}
              onClick={(e) => {props.dialogCreate.current.close()
              }}
            />
            </div>
            <div className="main">
                
             <label  >Choisissez un nom de compte:</label>
            <input  name="a" ref={name} type="text"  autoComplete="hidden" placeholder="Nom de compte"  /> 
            <label  >Choisissez un mot de passe:</label>
            <input  name="b" ref={password} type="text"  autoComplete="hidden" placeholder="Mot de passe"  />
<div className="role__container">
                <div onClick={(e)=>toggleRole(e)}className={"btn"}>admin</div>
                <div onClick={(e)=>toggleRole(e)} className={"btn"}>employe</div>
            </div>
            </div>
            <div className="buttons__container">
                <div className="div"></div>
            <button onClick={()=>{
                verifyForm()
            }}>Créer le compte</button>
            </div>
        </dialog>
    )
}
export default Account