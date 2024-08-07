import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SensorInterface } from "@/components/sensor/SensorContext";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TrendingUp } from "lucide-react";
import { Value } from "@radix-ui/react-select";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

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
  const sensorDate = sensorInfo[0]?.date;
  const data = sensorInfo
    .map((sensor) => ({
      date: formatUTCDateToLocal(sensorDate),
      value: parseInt((sensor as any)[sensorKey], 10),
    }))
    .reverse();
  console.log("data" + JSON.stringify(data));
  return (
    <Card className="w-[440px] h-[330px]">
      <CardContent>
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            top: 20,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(11,17)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="value"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-desktop)",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        </LineChart>
      </ChartContainer>
      </CardContent>
    </Card>
  );
}
