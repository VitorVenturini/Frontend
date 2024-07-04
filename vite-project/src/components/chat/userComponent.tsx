import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UserInterface } from "../user/UserContext";

interface OptProps {
  user: UserInterface;
  onClick: () => void; 
}

export default function UserComponent({
  user,
  onClick
}: 
OptProps) {
  const commonClasses =
    "w-[60px] h-[60px] rounded-lg border bg-border text-card-foreground shadow-sm p-1 flex items-center justify-center";

    const handleClick = () => {
      onClick();
    };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={`${commonClasses} flex flex-col cursor-pointer`}
            onClick={handleClick}
          >
            <div className="flex items-center gap-1 cursor-pointer">
              <p className="text-sm font-medium leading-none">{user.name}</p>
            </div>
            {/* <div>
                    <p>{button.button_prt}</p>
                  </div> */}
          </div>
        </DialogTrigger>
        {/* {isAdmin && (
              <DialogContent>
                <CardOptSensor
                  selectedUser={selectedUser}
                  selectedOpt={selectedOpt}
                  clickedPosition={clickedPosition}
                  existingButton={button}
                  isUpdate={true}
                />
              </DialogContent>
            )} */}
      </Dialog>
    </div>
  );
}
