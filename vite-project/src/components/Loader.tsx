import React  from "react";
import LogoCore from "../assets/Vector.svg";
import c from "../assets/c.svg"
import o from "../assets/o.svg"
import r from "../assets/r.svg"
import e from "../assets/e.svg"

export default function Loader(){
    return(
        <div className=" flex w-[100vw] h-[100vh] items-center justify-center">
            <div className="flex gap-5 mx-11 ">
                <img src={c}  />
                <img src={o} className="animate-spin" />
                <img src={r}  />
                <img src={e}  />
            </div>
        </div>
    )
}