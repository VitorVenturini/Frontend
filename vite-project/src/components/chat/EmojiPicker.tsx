import React, { useState } from "react";
import  Picker  from "@emoji-mart/react";
//import "@emoji-mart/react/dist/emoji-mart.css"; // Certifique-se de importar o CSS correto

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    onSelectEmoji(emoji.native); // Passa o emoji selecionado para o pai
    setShowPicker(false); // Fecha o picker após a seleção
  };

  return (
    <div>
      {/* Botão para abrir o picker de emojis */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="p-2"
      >
        😀 {/* Emoji de rosto sorridente */}
      </button>
      {showPicker && (
        <Picker
          onEmojiSelect={handleEmojiSelect}
        // style={{ position: "relative", top: "0px", right: "0" }}
        />
      )}
    </div>
  );
};

export default EmojiPicker;
