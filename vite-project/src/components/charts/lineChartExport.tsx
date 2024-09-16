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

type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

interface GraficoProps {
  chartData: any[];
  checkedKeys: { [key: string]: boolean }; // Recebe o estado checkedKeys
}

export function GraficoExport({ chartData, checkedKeys }: GraficoProps) {
  const [dataChartConfig, setDataChartConfig] = useState<ChartConfig>({});
  const [keys, setKeys] = useState<string[]>([]);
  const [minMaxValues, setMinMaxValues] = useState<{
    [key: string]: [number, number];
  }>({});

  // Função para gerar uma cor baseada em um índice
  const generateColor = (index: number): string => {
    const hue = (index * 137.5) % 360; // Distribui cores de forma uniforme
    return `hsl(${hue}, 70%, 50%)`;
  };

  useEffect(() => {
    if (chartData.length > 0) {
      const firstItem = chartData[0];
      const extractedKeys = Object.keys(firstItem).filter(
        (key) =>
          key !== "date" &&
          key !== "sensor_name" &&
          key !== "deveui" &&
          key !== "id"
      );
      setKeys(extractedKeys);

      // Construir o chartConfig dinamicamente
      const newChartConfig: ChartConfig = extractedKeys.reduce(
        (acc, key, index) => {
          acc[key] = {
            label: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza a primeira letra
            color: generateColor(index), // Gera uma cor com base no índice
          };
          return acc;
        },
        {} as ChartConfig
      );

      setDataChartConfig(newChartConfig);

      // Calcular min e max para cada chave
      const minMax = extractedKeys.reduce((acc, key) => {
        const values = chartData.map((item) => item[key]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        acc[key] = [min, max];
        return acc;
      }, {} as { [key: string]: [number, number] });

      setMinMaxValues(minMax);
    }
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{chartData[0]?.sensor_name}</CardTitle>
          <CardDescription>Descrição do sensor</CardDescription>
        </div>
        <div className="flex">
          {/* Renderizar os botões apenas para as chaves "checked" */}
          {keys
            .filter((key) => checkedKeys[key]) // Filtra as chaves com base no estado "checked"
            .map((key) => (
              <button
                key={key}
                data-active={true} // Todos os gráficos "checked" serão mostrados
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              >
                <span className="text-xs text-muted-foreground">
                  {dataChartConfig[key]?.label}
                </span>
              </button>
            ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6  max-h-[2000px] max-w-[3000px]">
        {/* Renderizar os gráficos apenas para as chaves "checked" */}
        {keys
          .filter((key) => checkedKeys[key]) // Filtra as chaves "checked"
          .map((key) => (
            <div key={key}>
              <ChartContainer
                key={key}
                config={dataChartConfig}
                className="aspect-auto h-[400px] w-full mb-6"
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    bottom: 20,
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    minTickGap={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={minMaxValues[key] || ["auto", "auto"]} // Define os limites do Y dinamicamente
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey={key}
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                        }}
                      />
                    }
                  />
                  <Line
                    dataKey={key}
                    type="monotone"
                    stroke={dataChartConfig[key]?.color}
                    strokeWidth={2}
                    dot={false}
                    clipPath="url(#clip)" // Adiciona o clipPath
                  />
                </LineChart>
              </ChartContainer>
              {/* Adiciona a quebra de página após cada gráfico */}
              <div className="page-break"></div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
