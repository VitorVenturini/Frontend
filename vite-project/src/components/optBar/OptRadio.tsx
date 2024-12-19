import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { useAccount } from "../account/AccountContext";
import { useUsers } from "../users/usersCore/UserContext";
import AudioRecorder from "../Radio/AudioRecorder";
import VideoRecorder from "../Radio/CallVideo";
interface OptRadioProps {
  clickedButton: ButtonInterface;
}

export default function OptRadio({ clickedButton }: OptRadioProps) {
  const account = useAccount();
  const { users } = useUsers();

  console.log("%cACCONT Radio", "font-size:30px", account);
  console.log("%cUSERS  Radio", "font-size:30px", users);
  return (
    <div className="flex flex-col align-middle items-stretch w-full h-full">
      <div className="flex w-full p-4 h-[300px]">
        <AudioRecorder />
      </div>
      <div className="flex w-full p-4 h-[400px]">
        <VideoRecorder />
      </div>
    </div>
  );
}
