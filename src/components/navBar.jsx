import { Menu,XCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserCtx } from '../App';
const NavBar=()=>{
  const user = useContext(UserCtx)[0]
    const [listState,setListState] =useState(false)
    useEffect(() => {
        const handleResize = () => {
          setListState(false)
        };
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [])
    return(
        <header>
            <div className='header__container'>
                <div className="logo__container"></div>
                {listState?<XCircle onClick={()=>setListState(!listState)} />:<Menu onClick={()=>setListState(!listState)} /> }
                <ul className={listState?"active":""}>
                    {
                      
                    user?<>
                    
                    <li><NavLink onClick={()=>setListState(!listState)} to="/">Rechercher</NavLink></li>
                    {user.role==="admin"?<li><NavLink onClick={()=>setListState(!listState)} to="/product/create">Ajouter</NavLink></li>:<></>}
                    <li><NavLink onClick={()=>setListState(!listState)} to="/stock">Stock</NavLink></li>
                    {user.role==="admin"?<li><NavLink onClick={()=>setListState(!listState)} to="/account">Comptes</NavLink></li>:<></>}
                    
                    <li><NavLink onClick={()=>{
                      localStorage.removeItem('JWT')
                      user(null)
                      setListState(!listState)
                      }} to="/identification">Se deconnecter</NavLink></li></>:<li><NavLink onClick={()=>setListState(!listState)} to="/identification">S'identifier</NavLink></li>}
                </ul>
            </div>
           
        </header>
    )
}
export default NavBar