import ButtonsComponent from "./ButtonsComponent";
import { ButtonInterface } from "./ButtonsContext";



export default function ButtonsRow (){
  

  return (
    <div className="flex gap-1 w-full">
        <ButtonsComponent />
        <ButtonsComponent />
        <ButtonsComponent  />
        <ButtonsComponent />
        <ButtonsComponent />
    </div>
  );
};
