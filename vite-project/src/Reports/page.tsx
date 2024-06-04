import { useState, useEffect } from 'react';
import { DataTable } from './data-table.tsx';
import { User,columns } from './Columns.tsx';

export default function DemoPage() {
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
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} />
    </div>
  );
}