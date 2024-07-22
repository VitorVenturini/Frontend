import React, { createContext, useState, useContext, ReactNode } from "react";


export interface CamerasInterface {
  id: string;
  mac: string;
  nickname: string;
  createdAt: string;
  create_user: string;
  updatedAt: string;
}

interface CamerasInterfaceType {
  cameras: CamerasInterface[];
  setCameras: React.Dispatch<React.SetStateAction<CamerasInterface[]>>;
  addCamera: (Camera: CamerasInterface) => void;
  updateCamera: (Camera: CamerasInterface) => void;
  deleteCamera: (id: string) => void;
  clearCameras: () => void;
}

const CamerasContext = createContext<CamerasInterfaceType | undefined>(
  undefined
);
export const CameraProvider = ({ children }: { children: ReactNode }) => {
  const [cameras, setCameras] = useState<CamerasInterface[]>([]);
  
  const addCamera = (Camera: CamerasInterface) => {
    setCameras((prevCameras) => [...prevCameras, Camera]);
  };

  const updateCamera = (updatedCamera: CamerasInterface) => {
    setCameras((prevCameras) =>
      prevCameras.map((Camera) =>
        Camera.id === updatedCamera.id
          ? { ...Camera, ...updatedCamera }
          : Camera
      )
    );
  };

  const clearCameras = () => {
    setCameras([]);
  };

  const deleteCamera = (id: string) => {
    setCameras((prevCameras) =>
      prevCameras.filter((Camera) => Camera.id !== id)
    );
  };
  console.log("CamerasContext Cameras", cameras);
  return (
    <CamerasContext.Provider
      value={{
        cameras,
        setCameras,
        addCamera,
        clearCameras,
        deleteCamera,
        updateCamera,
      }}
    >
      {children}
    </CamerasContext.Provider>
  );
};

export const useCameras = (): CamerasInterfaceType => {
  const context = useContext(CamerasContext);
  if (context === undefined) {
    throw new Error("useCameras must be used within a CameraProvider");
  }

  return context;
};
