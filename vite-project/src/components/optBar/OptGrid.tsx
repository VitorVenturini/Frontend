import { Separator } from "@/components/ui/separator";
import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { useEffect, useState } from "react";
import OptComponent from "@/components/optBar/OptComponent";
import { useAccount } from "@/components/account/AccountContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import TestKeyboard from "../testeKeyboard";
import UserComponent from "../chat/OptUser";
import { useUsers } from "../user/UserContext";

interface OptGridProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
  setClickedButtonId: (id: number | null) => void;
  clickedButtonId: number | null;
  clickedUser: string | null;
  setClickedUser: (newUser: string | null) => void;
  comboStart: boolean;
  //   selectedPage : string
}

interface User {
  id: string;
  name: string;
  guid: string;
}

export default function OptGrid({
  buttons,
  selectedUser,
  selectedOpt,
  setClickedButtonId,
  clickedButtonId,
  clickedUser,
  setClickedUser,
  comboStart,
}: OptGridProps) {
  const [clickedPosition, setClickedPosition] = useState<{
    i: number;
    j: number;
  } | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const wss = useWebSocketData();
  const account = useAccount();
  const { users } = useUsers();
  const { setStopCombo } = useButtons();
  const [lastClickedButtonId, setLastClickedButtonId] = useState<number | null>(
    null
  );

  const handleClickedUser = (newUser: string | null) => {
    if (setClickedUser) {
      setClickedUser(newUser);
    }
  };
  // useEffect para combos 
  useEffect(() => {
    if (comboStart) {
      const buttonInCombo = buttons.find((button) => button.comboStart);
      if (buttonInCombo) {
        setClickedButtonId(buttonInCombo.id); // setar o botão clicado atualmente 
        setLastClickedButtonId(buttonInCombo.id); // setar o ultimo botão clicado , ou seja , oq está com o combo ativo
        if( buttonInCombo.button_type === "sensor" || buttonInCombo.button_type === "camera"){
          wss?.sendMessage({
            api: "user",
            mt: "SelectDeviceHistory",
            id: buttonInCombo.button_prt,
          });
        } // enviar mensagem para consultar sensores e cameras ao receber o combo
      }
    }
  }, [comboStart, buttons]); // toda vez que carregar o grid , verificar se um dos botões tem um combo

  if (selectedOpt === "chat") {
    // quando for do TIPO CHAT O TRATAMENTO É DIFERENTE
    // precisamos melhorar isso ~vitor ~pietro
    const grid = Array(2)
      .fill(null)
      .map(() => Array(6).fill({ variant: "default" }));
    users.forEach((user, index) => {
      const x = Math.floor(index / 6) + 1; // Calcula a posição x
      const y = (index % 6) + 1; // Calcula a posição y

      if (x <= 2 && y <= 6) {
        grid[x - 1][y - 1] = user;
      }
    });

    return (
      <div>
        <div className="grid grid-rows-2 grid-cols-6 gap-1">
          {grid.map((row, i) =>
            row.map((user, j) => (
              <div key={`${i}-${j}`}>
                <UserComponent
                  user={user}
                  onClick={() => {
                    handleClickedUser(
                      clickedUser === user.guid ? null : user.guid
                    );
                  }}
                  clickedUser={clickedUser}
                  selectedOpt={selectedOpt}
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  } else if (selectedOpt != "chat") {
    const grid = Array(2)
      .fill(null)
      .map(() => Array(6).fill({ variant: "default" }));

    buttons.forEach((button) => {
      const x = Number(button.position_x);
      const y = Number(button.position_y);

      if (!isNaN(x) && !isNaN(y)) {
        grid[y - 1][x - 1] = button;
      }
    });
    return (
      <div>
        <div className="grid grid-rows-2 grid-cols-6 gap-1">
          {grid.map((row, i) =>
            row.map((button, j) => (
              <div key={`${i}-${j}`}>
                <OptComponent
                  button={button}
                  comboStart={comboStart}
                  selectedUser={selectedUser}
                  clickedPosition={clickedPosition}
                  selectedOpt={selectedOpt}
                  isClicked={clickedButtonId === button.id} // true or false
                  onClick={() => {
                    if (account.isAdmin) {
                      setClickedPosition({ i: i + 1, j: j + 1 });
                      console.log(
                        `Clicked position state:`,
                        "i: " + clickedPosition?.i + " j: " + clickedPosition?.j
                      );
                    } else {
                      // parar combo do botão anterior se existir
                      if (lastClickedButtonId !== null) {
                        const lastClickedButton = buttons.find(
                          (btn) => btn.id === lastClickedButtonId
                        );
                        if (lastClickedButton && lastClickedButton.comboStart) {
                          setStopCombo(lastClickedButton.id); 
                          //parar o combo ao trocar de botão pois se nao ele vai ficar sempre no botão que está com o combo ativo
                        }
                      }

                      // usuário
                      if (
                        (clickedButtonId !== button.id &&
                          button.button_type === "sensor") ||
                        button.button_type === "camera"
                      ) {
                        // enviar mensagem para consultar imagem da câmera ou infos do sensor
                        wss?.sendMessage({
                          api: "user",
                          mt: "SelectDeviceHistory",
                          id: button.button_prt,
                        });
                      }

                      // // Atualizar o estado do último botão clicado
                      // setLastClickedButtonId(button.id);

                      setClickedButtonId(
                        clickedButtonId === button.id ? null : button.id
                      );
                    }
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

// const clickedButton = buttons.filter(button => button.id === clickedButtonId)[0];
