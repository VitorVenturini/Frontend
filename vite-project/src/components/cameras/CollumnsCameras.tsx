import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Pencil } from "lucide-react";
import CardCreateCameras from "./CardCreateCameras";
import { CamerasInterface } from "./CameraContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import DeleteCamera from "./deleteCameras";


export const camerasCollumns: ColumnDef<CamerasInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nickname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apelido
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "mac",
    header: "Mac Address",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const cameras = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      return (
        <div className="flex justify-center gap-1 items-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Pencil />
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
              <CardCreateCameras
                camera={cameras}
                isUpdate={true}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
            <DeleteCamera id={cameras.id}/>
        </div>
      );
    },
  },
];
