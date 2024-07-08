import React, { useState, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function TestKeyboard() {
  const [layoutName, setLayoutName] = useState("default");
  const [input, setInput] = useState("");
  const keyboardRef = useRef<any>(null);

  const onChange = (input: string) => {
    setInput(input);
    console.log("Input changed", input);
  };

  const onKeyPress = (button: string) => {
    console.log("Button pressed", button);

    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const handleShift = () => {
    setLayoutName((prevLayoutName) =>
      prevLayoutName === "default" ? "shift" : "default"
    );
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value;
    setInput(input);
    if (keyboardRef.current) {
      keyboardRef.current.setInput(input);
    }
  };

  return (
    <div>
      <input
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={(e) => onChangeInput(e)}
      />
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        theme={"hg-theme-default myTheme1"}
        layoutName={layoutName}
        onChange={(input) => onChange(input)}
        onKeyPress={(button) => onKeyPress(button)}
      />
    </div>
  );
}
