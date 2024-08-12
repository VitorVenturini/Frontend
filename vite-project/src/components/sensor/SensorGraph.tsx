"use client";
import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSensors } from "@/components/sensor/SensorContext";
import { Label } from "@/components/ui/label";

type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

interface SensorGraphProps {
  chartData: any[];
}

export function SensorGraph({ chartData }: SensorGraphProps) {
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [dataChartConfig, setDataChartConfig] = useState<ChartConfig>({});
  const [keys, setKeys] = useState<string[]>([]);
  const [actionExecDevice, setActionExecDevice] = useState("");
  const { sensors } = useSensors();

  // Função para gerar uma cor baseada em um índice
  const generateColor = (index: number): string => {
    const hue = (index * 137.5) % 360; // Distribui cores de forma uniforme
    return `hsl(${hue}, 70%, 50%)`;
  };

  useEffect(() => {
    if (chartData.length > 0) {
      const firstItem = chartData[0];
      const keys = Object.keys(firstItem).filter(
        (key) =>
          key !== "date" &&
          key !== "sensor_name" &&
          key !== "deveui" &&
          key !== "battery" &&
          key !== "id"
      );
      setKeys(keys);

      // Construir o chartConfig dinamicamente
      const newChartConfig: ChartConfig = keys.reduce((acc, key, index) => {
        acc[key] = {
          label: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza a primeira letra
          color: generateColor(index), // Gera uma cor com base no índice
        };
        return acc;
      }, {} as ChartConfig);

      setDataChartConfig(newChartConfig);
      setActiveChart(keys[0] || null); // Definir a primeira chave como o gráfico ativo
    }
  }, [chartData]);
  const handleExecDevice = (value: string) => {
    setActionExecDevice(value);
  };
  return (
    <Card className="w-full h-full ">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex justify-center gap-1 px-2 py-2 ">
      
          {keys.map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="flex flex-1 flex-col justify-center gap-1 border-t p-2  text-left  data-[active=true]:bg-muted/50"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {dataChartConfig[key]?.label}
                </span>
              </button>
            );
          })}
        </div>
       
        
      </CardHeader>
      <CardContent className="h-full w-full">
        <ChartContainer
          config={dataChartConfig}
          className="aspect-auto h-full w-full"
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
            {activeChart && (
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={dataChartConfig[activeChart]?.color}
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
