"use client";
import React, { useState, useEffect } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-04-01", desktop: "222", mobile: "150", phone: "200" },
  { date: "2024-04-02", desktop: "27", mobile: "180", phone: "100" },
  { date: "2024-04-03", desktop: "167", mobile: "120", phone: "120" },
  { date: "2024-04-04", desktop: "242", mobile: "260", phone: "250" },
  { date: "2024-04-05", desktop: "373", mobile: "290", phone: "130" },
  { date: "2024-04-06", desktop: "301", mobile: "340", phone: "150" },
  { date: "2024-04-07", desktop: "245", mobile: "180", phone: "200" },
  { date: "2024-04-08", desktop: "409", mobile: "320", phone: "200" },
  { date: "2024-04-09", desktop: "159", mobile: "110", phone: "200" },
  { date: "2024-04-10", desktop: "261", mobile: "190", phone: "200" },
  { date: "2024-04-11", desktop: "327", mobile: "350", phone: "120" },
  { date: "2024-04-12", desktop: "92", mobile: "210", phone: "180" },
  { date: "2024-04-13", desktop: "342", mobile: "380", phone: "150" },
  { date: "2024-04-14", desktop: "137", mobile: "220", phone: "300" },
  { date: "2024-04-15", desktop: "120", mobile: "170", phone: "200" },
  { date: "2024-04-16", desktop: "138", mobile: "190", phone: "160" },
  { date: "2024-04-17", desktop: "46", mobile: "360", phone: "140" },
  { date: "2024-04-18", desktop: "364", mobile: "410", phone: "130" },
  { date: "2024-04-19", desktop: "243", mobile: "180", phone: "150" },
  { date: "2024-04-20", desktop: "189", mobile: "150", phone: "110" },
  { date: "2024-04-21", desktop: "137", mobile: "200", phone: "100" },
  { date: "2024-04-22", desktop: "224", mobile: "170", phone: "230" },
  { date: "2024-04-23", desktop: "138", mobile: "230", phone: "150" },
  { date: "2024-04-24", desktop: "387", mobile: "290", phone: "280" },
];
type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

// Função para gerar uma cor baseada em um índice
const generateColor = (index: number): string => {
  const hue = (index * 137.5) % 360; // Distribui cores de forma uniforme
  return `hsl(${hue}, 70%, 50%)`;
};

// Array de dados

// Obter as chaves (excluindo "date")
const firstItem = chartData[0];
const keys = Object.keys(firstItem).filter((key) => key !== "date");

// Construir o chartConfig dinamicamente
const dataChartConfig: ChartConfig = keys.reduce((acc, key, index) => {
  acc[key] = {
    label: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza a primeira letra
    color: generateColor(index), // Gera uma cor com base no índice
  };
  return acc;
}, {} as ChartConfig);

console.log("dataChartConfig", dataChartConfig);

export function Grafico() {
  const [activeChart, setActiveChart] = React.useState<
    keyof typeof dataChartConfig
  >(keys[0]);

  const [chartData, setChartData] = useState([]);
  

  useEffect(() => {
    // Função para atualizar chartData via WebSocket
    const handleDataUpdate = (newData) => {
      setChartData(newData);
    };
    return () => {
      // Remova o listener de WebSocket aqui, se necessário
    };
  }, []);
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sensor: Nome do Sensor</CardTitle>
          <CardDescription>Descrição do sensor</CardDescription>
        </div>
        <div className="flex">
          {keys.map((key) => {
            const chart = key as keyof typeof dataChartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {dataChartConfig[chart].label}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-2">
        <ChartContainer
          config={dataChartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 25,
              bottom: 25,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
