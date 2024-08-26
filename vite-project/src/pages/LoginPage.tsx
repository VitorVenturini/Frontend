import icone from "@/assets/icone.svg";

import CardLogin from "@/components/login/CardLogin";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import LogoCore from "../assets/LogoCore.svg";
import LogoWecom from "../assets/WecomLogo.svg";

export default function LoginPage() {
  return (
    <div className=" flex align-middle content-center justify-center">
      <div className="flex basis-1/2 justify-end align-middle- py-60 px-12">
        <LanguageToggle />
        <CardLogin />
      </div>
      <div className=" basis-1/2  w-full h-[100vh] bg-card flex justify-center  py-60 px-12">
        <div className="flex flex-col justify-center  align-middle pr-16 w-full gap-7">
          <img src={LogoCore} alt="Logo" className="" />
          <p className=" flex text-2xl font-extrabold tracking-tight lg:text-3xl w-full justify-center align-middle">
            CONTROL OPERATION RESPONSIVE ENVIRONMENT
          </p>
          <img src={LogoWecom} alt="logow" className="h-9" />
        </div>
      </div>
    </div>
  );
}
