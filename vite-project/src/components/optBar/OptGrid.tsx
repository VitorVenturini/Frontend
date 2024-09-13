import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { useEffect, useRef, useState } from "react";
import OptComponent from "@/components/optBar/OptComponent";
import { useAccount } from "@/components/account/AccountContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import UserComponent from "../chat/MessageList";
import { UserInterface, useUsers } from "../users/usersCore/UserContext";
import OptUser from "../chat/MessageList";
import MessageList from "../chat/MessageList";
import { useChat } from "../chat/ChatContext";
import { Button } from "react-chat-elements";

interface OptGridProps {
  buttons: ButtonInterface[];
  selectedUser: UserInterface | null;
  selectedOpt: string;
  interactive: string;
  setClickedButtonId: (id: number | null, grid: string) => void; // Updated type
  clickedButtonId: number | null;
  clickedUser: string | null;
  setClickedUser: (newUser: string | null) => void;
  //   selectedPage : string
}


export default function OptGrid({
  buttons,
  selectedUser,
  selectedOpt,
  setClickedButtonId,
  clickedButtonId,
  clickedUser,
  setClickedUser,
  interactive,
}: OptGridProps) {
  const [clickedPosition, setClickedPosition] = useState<{
    i: number;
    j: number;
  } | null>(null);
  // const [isClicked, setIsClicked] = useState(false);
  const wss = useWebSocketData();
  const account = useAccount();
  const { users } = useUsers();
  const { setStopCombo } = useButtons();
  const [comboStarted, setComboStarted] = useState<number | null>(null);
  const comboStartedRef = useRef<number | null>(null);
  const myAccountInfo = JSON.parse(
    localStorage.getItem(account.session) || "{}"
  );
  const { chat } = useChat();
  const handleClickedUser = (newUser: string | null) => {
    if (setClickedUser) {
      setClickedUser(newUser);
    }
  };

  // Monitorar se o combo iniciou
  const processedButtonsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const buttonInCombo = buttons.find(
      (button) =>
        button.comboStart &&
        button.position_y === (interactive === "top" ? "1" : "2")
    );

    if (buttonInCombo && buttonInCombo.id !== comboStartedRef.current) {
      comboStartedRef.current = buttonInCombo.id;
      setComboStarted(buttonInCombo.id);
    }
  }, [buttons, interactive]);

  useEffect(() => {
    if (comboStarted) {
      const buttonInCombo = buttons.find(
        (button) => button.id === comboStarted
      );

      if (buttonInCombo && !processedButtonsRef.current.has(buttonInCombo.id)) {
        // Marcar o botão como processado
        processedButtonsRef.current.add(buttonInCombo.id);

        // Definir o botão como clicado
        setClickedButtonId(buttonInCombo.id, interactive);

        // Enviar mensagem TriggerStartOpt para o WebSocket
        wss?.sendMessage({
          api: "user",
          mt: "TriggerStartOpt",
          btn_id: buttonInCombo.id,
        });

        // Se o botão for do tipo sensor ou câmera, enviar mensagem adicional
        if (
          buttonInCombo.button_type === "sensor" ||
          buttonInCombo.button_type === "camera"
        ) {
          wss?.sendMessage({
            api: "user",
            mt: "SelectDeviceHistory",
            id: buttonInCombo.button_prt,
          });
        }
      }
    }
  }, [comboStarted]);

  // Lógica de clique
  const handleClick = (button: ButtonInterface) => {
    if (clickedButtonId === button.id) {
      // Parar o combo se o botão tiver um combo ativo
      if (button.comboStart) {
        console.log("Parando Combo para Opt...");
        setStopCombo(button.id);
      }
      // para permitir que o combo seja iniciado novamente
      if (comboStarted !== null) {
        setComboStarted(null);
        comboStartedRef.current = null;
        processedButtonsRef.current.clear();
      }

      // Se clicar no mesmo botão, fecha a opt
      setClickedButtonId(null, interactive);
    } else {
      // Se clicar em um botão diferente ou novo

      // para permitir que o combo seja iniciado novamente
      if (comboStarted !== null) {
        setStopCombo(clickedButtonId as number);
        setComboStarted(null);
        comboStartedRef.current = null;
        processedButtonsRef.current.clear();
      }
      // Atualizar o botão clicado
      setClickedButtonId(button.id, interactive);

      // Enviar TriggerStartOpt ao abrir um novo botão
      wss?.sendMessage({
        api: "user",
        mt: "TriggerStartOpt",
        btn_id: button.id,
      });

      if (button.button_type === "sensor" || button.button_type === "camera") {
        // Enviar mensagem para consultar imagem da câmera ou informações do sensor
        wss?.sendMessage({
          api: "user",
          mt: "SelectDeviceHistory",
          id: button.button_prt,
        });
      }
    }
  };

  // resetar state comboStarted ao mudar de selectedOpt
  // ou ao clicar para fechar o botão
  useEffect(() => {
    if (comboStarted !== null) {
      setComboStarted(null);
      comboStartedRef.current = null;
      processedButtonsRef.current.clear();
    }
  }, [selectedOpt]);

  if (selectedOpt === "chat") {
    const usersWithLastMessage = users.map((user) => {
      const userMessages = chat.filter(
        (message) =>
          (message.to_guid === myAccountInfo.guid &&
            message.from_guid === user.guid) ||
          (message.from_guid === myAccountInfo.guid &&
            message.to_guid === user.guid)
      );

      const lastMessage = userMessages.sort(
        (a, b) =>
          new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
      )[0];

      return {
        ...user,
        lastMessage: lastMessage || null,
      };
    });

    const sortedUsers = usersWithLastMessage.sort((a, b) => {
      const dateA = a.lastMessage
        ? new Date(a.lastMessage.date as Date).getTime()
        : 0;
      const dateB = b.lastMessage
        ? new Date(b.lastMessage.date as Date).getTime()
        : 0;
      return dateB - dateA;
    });

    return (
      <div className="overflow-x-auto hide-scrollbar">
        <div className="gap-2">
          {sortedUsers
            ?.filter((user) => user.guid !== myAccountInfo.guid)
            .map((user) => (
              <MessageList
                key={user.guid}
                user={user}
                clickedUser={clickedUser}
                onClick={() => {
                  handleClickedUser(
                    clickedUser === user.guid ? null : user.guid
                  );
                }}
              />
            ))}
        </div>
      </div>
    );
  } else if (selectedOpt != "chat") {
    const grid =
      interactive === "top"
        ? Array(1)
            .fill(null)
            .map(() => Array(12).fill({ variant: "default" }))
        : Array(1)
            .fill(null)
            .map(() => Array(12).fill({ variant: "default" }));

    buttons?.forEach((button) => {
      const x = Number(button.position_x);
      const y = Number(button.position_y);

      if (!isNaN(x) && !isNaN(y)) {
        if (interactive === "top" && y === 1) {
          grid[0][x - 1] = button; // Grid de cima, linha 1
        } else if (interactive !== "top" && y === 2) {
          grid[0][x - 1] = button; // Grid de baixo, linha 2
        }
      }
    });

    return (
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-1">
          {grid[0].map((button, j) => (
            <div key={`${0}-${j}`}>
              <OptComponent
                button={button}
                selectedUser={selectedUser}
                clickedPosition={clickedPosition}
                selectedOpt={selectedOpt}
                isClicked={clickedButtonId === button.id} // true or false
                onClick={() =>
                  account.isAdmin
                    ? setClickedPosition({
                        i: interactive === "top" ? 1 : 2,
                        j: j + 1,
                      })
                    : handleClick(button)
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
