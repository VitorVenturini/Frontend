import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-tableReports"; // Ajuste o caminho conforme necessário

interface ColumnsReportsProps {
  report: string;
  data: any[];
  keys: string[];
}

const ColumnsReports: React.FC<ColumnsReportsProps> = ({ report, data, keys }) => {
  const columns: ColumnDef<any>[] = useMemo(() => {
    return keys.map((key) => ({
      accessorKey: key,
      header: key.toUpperCase(),
    }));
  }, [keys]);

  return (
    <div>
      <h2 className="flex justify-center font-bold">Relatório {report}</h2>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ColumnsReports;
