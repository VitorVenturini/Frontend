import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalls } from "../calls/CallContext";
import CallComponent from "../calls/CallComponent";

export default function OptCall() {
  const { calls } = useCalls();

  return (
    <ScrollArea className="w-full h-[200px]  lg:h-[290px]  xl2:h-[400px] xl3:h-[590px]  relative">
      {calls.map((call) => (
        <CallComponent key={call.id} buttonOnCall={call} />
      ))}
    </ScrollArea>
  );
}
