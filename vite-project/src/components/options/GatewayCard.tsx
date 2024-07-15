import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    ColumnFiltersState,
    useReactTable,
    SortingState,
    getSortedRowModel,
    getFilteredRowModel,
  } from "@tanstack/react-table";

export default function GatewayCard() {
    
  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <Input
        //   placeholder="Filter User..."
        //   value={
        //     (table.getColumn("action_name")?.getFilterValue() as string) || ""
        //   }
        //   onChange={(event) =>
        //     table.getColumn("action_name")?.setFilterValue(event.target.value)
        //   }
        //   className="max-w-sm"
        />
      </div>
      <Dialog>
        <DialogTrigger>
          <Button> Add Gateway</Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl "></DialogContent>
      </Dialog>
    </div>
  );
}
