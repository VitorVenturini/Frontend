import { useCameras } from "../cameras/CameraContext";
import { CamerasInterface } from "../cameras/CameraContext";
import { DataTableCameras } from "../cameras/data-tableCameras";
import { camerasCollumns } from "../cameras/CollumnsCameras";
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
        <div className="bg-card w-full max-w-2xl">
        <div>
          <DataTableCameras
            columns={camerasCollumns}
            data={cameras}
          ></DataTableCameras>
        </div>
      </div>
    );

}