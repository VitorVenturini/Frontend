import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/users/usersCore/data-tableUser";
import { columnsUser } from "@/components/users/usersCore/ColumnsUser";
import { useUsers } from "@/components/users/usersCore/UserContext";

//================================================

export default function Account() {
  const { users } = useUsers();

  return (
    <div className="px-2 flex flex-col gap-4 justify-center mx-[250px]">
      <ScrollArea className="h-[500px]">
        <DataTable columns={columnsUser} data={users} />
      </ScrollArea>
    </div>
  );
}
