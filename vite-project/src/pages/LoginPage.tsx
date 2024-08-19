import icone from "@/assets/icone.svg";

import CardLogin from "@/components/login/CardLogin"
import { LanguageToggle } from "@/components/language/LanguageToggle";


export default function LoginPage() {

  return (
    <div className=" flex align-middle content-center justify-center">
      <div className="flex basis-1/2 justify-end align-middle-700 py-60 px-12">
      <LanguageToggle />
        <CardLogin/>
      </div>
      <div className=" basis-1/2  w-full h-[100vh] bg-card flex justify-start align-middle py-60 px-12">
      </div>
    </div>
  );
}
