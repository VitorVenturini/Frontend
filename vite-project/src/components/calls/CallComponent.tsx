import { Pause, PhoneCall, Play } from "lucide-react";
import { ButtonInterface } from "../buttons/buttonContext/ButtonsContext";
import { useUsersPbx } from "../users/usersPbx/UsersPbxContext";

interface CallComponentProps {
  buttonOnCall: ButtonInterface;
}
export default function CallComponent({ buttonOnCall }: CallComponentProps) {
    {/*se nao tiver chamadas retorna um skeleton */}
  const { usersPbx } = useUsersPbx();
  const filteredUser = usersPbx?.filter((user) => {
    return user.guid === buttonOnCall.button_prt;
  })[0];
  return (
    <div className="flex">
      AVATAR AQUI
      <div>{filteredUser ? filteredUser.cn : buttonOnCall.button_prt}</div>
      <div><Pause/></div>
      <div><Play/></div>
      <div><PhoneCall/></div>
    </div>
  );
}
