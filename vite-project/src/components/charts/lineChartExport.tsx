import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import img from "../../assets/10991348.jpg"
interface ChartConfig {
  label: string;
  color: string;
}

interface GraficoProps {
  chartData: any[]; // Os dados brutos
  checkedKeys: { [key: string]: boolean }; // As chaves marcadas
}

export function GraficoExport({ chartData, checkedKeys }: GraficoProps) {
  const [chartConfigs, setChartConfigs] = useState<{
    [key: string]: ChartConfig;
  }>({});
  const [minMaxValues, setMinMaxValues] = useState<{
    [key: string]: [number, number];
  }>({});

  useEffect(() => {
    const keys = Object.keys(chartData[0] || {}).filter(
      (key) =>
        key !== "date" &&
        key !== "sensor_name" &&
        key !== "deveui" &&
        key !== "id"
    );

    const newChartConfigs = keys.reduce((acc, key, index) => {
      if (checkedKeys[key]) {
        acc[key] = {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        };
      }
      return acc;
    }, {} as { [key: string]: ChartConfig });

    setChartConfigs(newChartConfigs);
  }, [chartData, checkedKeys]);
  useEffect(() => {
    if (chartData.length > 0) {
      const minMax = Object.keys(chartConfigs).reduce((acc, key) => {
        const values = chartData.map((item) => item[key]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        acc[key] = [min, max];
        return acc;
      }, {} as { [key: string]: [number, number] });
      setMinMaxValues(minMax);
    }
  }, [chartData, chartConfigs]);

  return (
    <>
      {Object.keys(chartConfigs).map((key) => (
        <Card key={key} className="mb-6 avoid-page-break max-h-[2400px] max-w-[2400px] h-full w-full">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>{chartData[0]?.sensor_name}</CardTitle>
              <CardDescription>{chartConfigs[key].label}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6 max-h-[2300px] h-full max-w-[2300px]">

            <ChartContainer
              config={chartConfigs}
              className="aspect-auto max-h-[2200px] max-w-[2200px] h-full w-full"

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
                  domain={
                    minMaxValues && minMaxValues[key]
                      ? [minMaxValues[key][0], minMaxValues[key][1]]
                      : ["auto", "auto"]
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
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
                  stroke={chartConfigs[key]?.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
