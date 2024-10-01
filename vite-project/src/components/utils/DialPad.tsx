import React, { useCallback, useState } from "react";
import { Phone, Delete } from "lucide-react";

const DialPad = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  // Função para lidar com clique nos dígitos
  const handleDigitClick = useCallback(
    (value: string) => () => {
      setPhoneNumber((prev) => prev.concat(value));
    },
    []
  );

  // Função para realizar a chamada
  const handleDialClick = () => {
    console.log(`Chamando: ${phoneNumber}`);
    setPhoneNumber(""); // Limpa após chamar
  };

  // Função para remover dígitos
  const handleBackspaceClick = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-lg w-full max-w-[250px]">
      {/* Exibição do número */}
      <div className="text-white text-xl font-bold mb-4 w-full text-center py-2">
        {phoneNumber || "Digite o número"}
      </div>

      {/* Teclado numérico */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "*",
          "0",
          "#",
        ].map((digit) => (
          <button
            key={digit}
            onClick={handleDigitClick(digit[0])}
            className="w-10 h-10 sm:w-12 sm:h-12 text-white text-lg bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
          >
            <div className="flex flex-col items-center">
              {digit[0]}
              <span className="text-xs text-gray-400">{digit.slice(2)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Controles de ação */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDialClick}
          className="bg-green-500 hover:bg-green-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
        >
          <Phone className="text-white" />
        </button>

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
