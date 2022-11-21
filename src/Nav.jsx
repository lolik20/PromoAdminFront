import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./Nav.css"

export default function Nav(){
return(
    <div className="container">
        <nav>
        <Link to="/">Заявки (KZ,KG)</Link>
        <Link to="/uz">Заявки (UZ)</Link>
        <Link to="/all">QR коды</Link>

   <Link to="/all">Обработанные</Link>
        </nav>
   
<Outlet></Outlet>
</div>

);
}