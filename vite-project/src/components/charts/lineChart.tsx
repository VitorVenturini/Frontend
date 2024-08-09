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

interface GraficoProps {
  chartData: any[];
}

export function Grafico({ chartData }: GraficoProps) {
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
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Dados do Sensor</CardTitle>
          <CardDescription>Descrição do sensor</CardDescription>
        </div>
        <div className="flex">
          {keys.map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
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
