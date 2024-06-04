import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Value } from "@radix-ui/react-select";
import TableUser from "@/components/TableUser";
import { Loader2 } from "lucide-react";
import CardCreateAccount from "@/components/CardCreateAccount";
import DemoPage from "@/Reports/page";
import { DataTable } from "@/Reports/data-table";
import { User, columns } from "@/Reports/Columns";

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
      <div className="flex justify-between gap-5">
        <Input className="w-[500px]" placeholder="Nome de usuário..." />
        <CardCreateAccount />
      </div>
      <Card className="w-full min-h-[700px]">
        <ScrollArea className="h-[700px]">
          <TableUser />
        </ScrollArea>
      </Card>
      <DataTable columns={columns} data={users} />
    </div>
  );
}