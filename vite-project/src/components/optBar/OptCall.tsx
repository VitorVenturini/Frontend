import { ScrollArea } from "@/components/ui/scroll-area";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import CallComponent from "../calls/CallComponent";

export default function OptCall() {
  const { buttons } = useButtons();
  const buttonsOnCall = buttons.filter((btn) => {
    return btn?.onCall === true;
  });
  console.log("ButtonsOnCall" + JSON.stringify(buttonsOnCall));
  return (
      <ScrollArea className="h-[390px] w-full">
        {buttonsOnCall.map((button) => (
          <CallComponent buttonOnCall={button} />
        ))}
      </ScrollArea>
  );
}
