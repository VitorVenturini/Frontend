import React, { useCallback, useState } from "react";
import { Phone, Delete } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ModalDevices from "./ModalDevices";
import { useToast } from "@/components/ui/use-toast";

const DialPad = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();
  // Função para lidar com clique nos dígitos
  const handleDigitClick = useCallback(
    (value: string) => () => {
      setPhoneNumber((prev) => prev.concat(value));
    },
    []
  );

  // Função para remover dígitos
  const handleBackspaceClick = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const [openModalDevices, setOpenModalDevices] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (phoneNumber === "") {
      toast({
        title: "Erro",
        description: "Por favor, insira um número antes de ligar.",
        variant: "destructive",
      });
      return;
    }
    setOpenModalDevices(isOpen);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-lg w-full">
      {/* Exibição do número */}
      <div className="text-white xl2:text-xl font-bold mb-4 w-full text-center py-2">
        {phoneNumber || "Digite o número"}
      </div>

      {/* Teclado numérico */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
          (digit) => (
            <button
              key={digit}
              onClick={handleDigitClick(digit[0])}
              className=" lg:w-9 lg:h-9 xl:w-11 xl:h-11 2xl:w-15 2xl:h-15  text-white text-lg bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
            >
              <div className="flex flex-col items-center">
                {digit[0]}
                <span className="text-xs text-gray-400">{digit.slice(2)}</span>
              </div>
            </button>
          )
        )}
      </div>

      {/* Controles de ação */}
      <div className="flex justify-center gap-4">
        <div>
          <Popover open={openModalDevices} onOpenChange={handleOpenChange}>
            <PopoverTrigger>
              <button className="bg-green-500 hover:bg-green-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                <Phone className="text-white" />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <ModalDevices
                numberToCall={phoneNumber}
                onCallSuccess={() => {
                  setOpenModalDevices(false), setPhoneNumber("");
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <button
          onClick={handleBackspaceClick}
          className="bg-gray-500 hover:bg-gray-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
        >
          <Delete className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default DialPad;
