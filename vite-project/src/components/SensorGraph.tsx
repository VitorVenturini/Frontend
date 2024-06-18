import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SensorInterface } from "./SensorContext";

interface SensorGraphProps {
  sensorInfo: SensorInterface[];
  sensorKey: string;
}

function formatUTCDateToLocal(dateString: string | undefined): string {
  if (!dateString) {
    return "Invalid Date";
  }

  const date = new Date(dateString);

  // Formatar a data para o fuso horário local
  const formattedDate = new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  console.log("formattedDate" + formattedDate);
  return formattedDate;
}

export default function SensorGraph({
  sensorInfo,
  sensorKey,
}: SensorGraphProps) {
  const sensorDate = sensorInfo[0].date;
  const data = sensorInfo
    .map((sensor) => ({
      date: formatUTCDateToLocal(sensorDate),
      value: parseInt((sensor as any)[sensorKey], 10),
    }))
    .reverse();
  return (

    <ResponsiveContainer width={"100%"} aspect={2.5} className="">
        <LineChart

        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend /
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
