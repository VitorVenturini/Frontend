import icone from "@/assets/icone.svg";

import CardLogin from "@/components/login/CardLogin";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import LogoCore from "../assets/LogoCore.svg";
import LogoWecom from "../assets/WecomLogo.svg";
import { ModeToggle } from "@/components/mode-toggle";

export default function LoginPage() {
  return (
    <div className=" flex   align-middle content-center justify-center">
      <div className="flex basis-1/2 justify-end align-middle items-center pr-11">
        <div className="flex flex-col gap-2">
          <CardLogin />
          
          <div className="flex space-x-2 justify-end"> 

          <LanguageToggle />
          <ModeToggle />

          </div>
        </div>
      </div>
      <div className="flex basis-1/2  w-full h-[100vh] bg-card  justify-start align-middle items-center pl-11">
        <div className="flex flex-col justify-center  align-middle pr-16 w-full gap-7">
          <img src={LogoCore} alt="Logo" className="" />
          <p className=" flex text-2xl font-extrabold tracking-tight lg:text-3xl w-full justify-center align-middle"></p>
          <img src={LogoWecom} alt="logow" className="h-9" />
        </div>
      </div>
    </div>
  );
}
