import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./Nav.css"

export default function Nav(){
return(
    <div className="container">
        <nav>
        <Link to="/">Заявки</Link>
   <Link to="/all">Обработанные</Link>
        </nav>
   
<Outlet></Outlet>
</div>

);
}