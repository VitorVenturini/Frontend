import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/users/usersCore/data-tableUser";
import { columnsUser } from "@/components/users/usersCore/ColumnsUser";
import { useUsers } from "@/components/users/usersCore/UserContext";
import { useUsersPbx } from "@/components/users/usersPbx/UsersPbxContext";
//================================================

export default function Account() {
  const { users } = useUsers();
  const { usersPbx } = useUsersPbx();
  let ajustData

  ajustData = users.map((item: any) => {
    if(users){
      item = replaceData(usersPbx, item, 'sip')
      
    }return item
  
  })

  function replaceData(
    users: any[],
    item: any,
    columnName: string
  ): any {
    const user = users.find(
      (user: any) =>
        user.guid === item[columnName] || user.sip === item[columnName]
    );
    if (user) {
      item[columnName] = user.e164 
    }
    return item;
  }
  
  return (
    <div className=" flex flex-col px-12 xl2:px-20 justify-center">
      <ScrollArea className=" lg:h-[500px] xl:h-[600px] xl2:h-[700px] xl3:h-[800px] xl4:h-[900px]">
      <DataTable columns={columnsUser} data={users} />
      </ScrollArea>
        
      
    </div>
  );
}
