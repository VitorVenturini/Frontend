
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { DataTable } from "@/Reports/data-tableUser";
import { User, columnsUser } from "@/Reports/ColumnsUser";

//================================================

export default function Account() {
  const [users, setUsers] = useState<User[]>([]);

  const listUsers = async () => {
    try {
      const response = await fetch("https://meet.wecom.com.br/api/listUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
      });
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    listUsers();
  }, []);

  return (
    <div className="px-2 flex flex-col gap-4 justify-center mx-[250px]">
      <ScrollArea className="h-[500px]">
        <DataTable columns={columnsUser} data={users} />
      </ScrollArea>
    </div>
  );
}
