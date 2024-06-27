import { ButtonInterface } from "../buttonContext/ButtonsContext";
import { Layers3 } from "lucide-react";

interface ComboProps {
  button: ButtonInterface;
}
export default function ComboButton({ button }: ComboProps) {
  const commonClasses =
    "w-[128px] h-[55px] rounded-lg border bg-border text-white shadow-sm p-1";

  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer bg-buttonCombo`}
      //onClick={handleClickAlarm}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        <Layers3 />
        <p className="text-sm font-medium leading-none">{button.button_name}</p>
      </div>
      <div>
        {/* <p>{button.button_prt}</p> */}
      </div>
    </div>
  );
}
