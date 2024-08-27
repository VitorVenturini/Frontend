import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import CallComponent from "../calls/CallComponent";

export default function OptCall() {
  const { buttons } = useButtons();
  const buttonsOnCall = buttons.filter((btn) => {
    return btn?.onCall === true
  });
  console.log("ButtonsOnCall" + JSON.stringify(buttonsOnCall))
  return (
    <div>
        CALL
      {buttonsOnCall.map((button) => (
        <div>
          <CallComponent buttonOnCall ={button} />
        </div>
  
      ))}
    </div>
  );
}
