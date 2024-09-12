import { useCameras } from "../cameras/CameraContext";
import { CamerasInterface } from "../cameras/CameraContext";
import { DataTableCameras } from "../cameras/data-tableCameras";
import { camerasCollumns } from "../cameras/CollumnsCameras";
import { ScrollArea } from "../ui/scroll-area";
interface cameras {
  id: string;
  mac: string;
  createdAt: string;
  create_user: string;
  updatedAt: string;
}


export default function IotCameraCard(){
    const { cameras } = useCameras();

    console.log("GATEWAYS CARD", cameras);

    return(
        <div className=" w-full max-w-2xl">
        <ScrollArea className="lg:h-[500px] xl:h-[500px] xl2:h-[500px] xl3:h-[600px] xl4:h-[700px]">
          <DataTableCameras
            columns={camerasCollumns}
            data={cameras}
          ></DataTableCameras>
        </ScrollArea>
      </div>
    );

}