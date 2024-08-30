import React  from "react";
import LogoCore from "../assets/Vector.svg";
import c from "../assets/c.svg"
import o from "../assets/o.svg"
import r from "../assets/r.svg"
import e from "../assets/e.svg"
import logoWecom from "../assets/WecomLogo.svg"
export default function Loader(){
    return(
        <div className=" fixed inset-0 z-50 bg-black/80">
            <div className=" fixed left-[50%] top-[50%] z-50 grid grid-cols-4 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-transparent p-6 shadow-lg duration-200 ">
                <img src={c}  />
                <img src={o} className="animate-spin" />
                <img src={r}  />
                <img src={e}  />
                <img src={logoWecom} alt=""  className="col-span-3 opacity-20"/>
            </div>
            
        </div>
    )
}