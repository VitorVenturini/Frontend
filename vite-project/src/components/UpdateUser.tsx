import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import React, { useEffect, useState, ChangeEvent } from "react";

  interface User {
    id: string;
    name: string;
    guid: string;
    email: string;
    sip: string;}
//================================================

export default function UpdateUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [sip, setSip] = useState("");
    const [type, setType] = useState<string>("");
    
    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
      };

      const handleSipChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSip(event.target.value);
      };
      const handleTypeChange = (value: string) => {
        setType(value);
      };
      const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
      };

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
    const updateUser = async (id: string) => {
      console.log(`id: ${id},name:${name},email:${email},type:${type},sip:${sip}`);
      const formData = {
        id: id,
      };
      try {
        const response = await fetch("https://meet.wecom.com.br/api/updateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth": localStorage.getItem("token") || "",
          },
          body: JSON.stringify(formData),
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
  return <div></div>;
}
