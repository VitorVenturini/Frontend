import ButtonsRow from './ButtonsRow';
import { Separator } from "@/components/ui/separator"
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
import ButtonsComponent from './ButtonsComponent';


interface ButtonsGridProps {
  buttons: ButtonInterface[];
}

export default function ButtonsGrid({buttons} : ButtonsGridProps) {
//  const {buttons} = useButtons()
//  console.log("Todos botões do usuario" + JSON.stringify(buttons))

  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className=" gap-6">
        {buttons.map((button) => (
          <div key={button.id}>
            {/* <h3>Nome do botão: {button.button_name}</h3>
            <h3>Posição X: {button.position_x}</h3>
            <h3>Posição Y: {button.position_y}</h3>
            <h3>Página {button.page}</h3>
            <h3>================================</h3> */}
            <ButtonsComponent button ={button}/>
            {/* Renderize outras informações do botão conforme necessário */}
          </div>
        ))}
      </div>
      
    </div>
  );
}