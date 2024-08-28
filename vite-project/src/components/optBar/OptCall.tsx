import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalls } from "../calls/CallContext";
import CallComponent from "../calls/CallComponent";

export default function OptCall() {
  const { calls } = useCalls();

  return (
    <ScrollArea className="h-[390px] w-full">
      {calls.map((call) => (
        <CallComponent key={call.id} buttonOnCall={call} />
      ))}
    </ScrollArea>
  );
}
