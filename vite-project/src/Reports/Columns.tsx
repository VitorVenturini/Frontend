"use client"

import { ColumnDef } from "@tanstack/react-table"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface User {
  id: string;
  name: string;
  guid: string;
  email: string;
  sip: string;
  // Adicione aqui outros campos se necessário
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "guid",
    header: "GUID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "sip",
    header: "SIP",
  },
  // Adicione aqui outras colunas conforme necessário
];
