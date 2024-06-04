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
}
export default function SensorGraph({ sensorInfo }: SensorGraphProps) {
  const data = sensorInfo;
  return (
    <ResponsiveContainer width={"100%"} aspect={1.2}>
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
          <Line type="monotone" dataKey="co2" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="battery" stroke="#82ca9d" />
          <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
          <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
          <Line type="monotone" dataKey="leak" stroke="#82ca9d" />
          <Line type="monotone" dataKey="pir" stroke="#82ca9d" />
          <Line type="monotone" dataKey="light" stroke="#82ca9d" />
          <Line type="monotone" dataKey="tvoc" stroke="#82ca9d" />
        </LineChart>
        </ResponsiveContainer>
  );
}
