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
  sensorKey : string;
}
export default function SensorGraph({ sensorInfo, sensorKey }: SensorGraphProps) {
  const data = sensorInfo;
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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey= {sensorKey} stroke="#8884d8" activeDot={{ r: 8 }} />
        
        </LineChart>
        </ResponsiveContainer>
  );
}
