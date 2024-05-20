import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  interface User {
    id: string;
    name: string;
  }

  interface TableActionsProps {
    selectedUser: User | null;
  }

export default function TableActions({selectedUser} : TableActionsProps){
    return(
        <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            {/* <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{selectedUser?.id}</TableCell>
            <TableCell>{selectedUser?.name}</TableCell>
            {/* <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell> */}
          </TableRow>
        </TableBody>
      </Table>
    )
}

