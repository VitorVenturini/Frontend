"use client";
import React, { useState, useEffect } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSensors } from "@/components/sensor/SensorContext";
import { getText } from "../utils/utilityFunctions";
import texts from "../../_data/texts.json";
import { useLanguage } from "../language/LanguageContext";
import ModeDetector, {
  SensorModes,
  SensorModeResult,
} from "@/components/sensor/VS-121/ModeDetector";
import LineCrossingView from "./VS-121/LineCrossingView";
import PeopleFlowView from "./VS-121/PeopleFlowView";
import RegionCountingView from "./VS-121/RegionCountingView";

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
  const { language } = useLanguage();
  const [dataChartConfig, setDataChartConfig] = useState<ChartConfig>({});
  const [keys, setKeys] = useState<string[]>([]);
  const [sensorModeData, setSensorModeData] = useState<SensorModeResult | null>(
    null
  );
  const [minMaxValues, setMinMaxValues] = useState<[number, number] | null>(
    null
  );

  const generateColor = (index: number): string => {
    const hue = (index * 137.5) % 360;
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

      //       const keys2 = Object.keys(chartData[chartData.length -1]).filter(
      //         (key) =>
      //           key !== "date" &&
      //           key !== "sensor_name" &&
      //           key !== "deveui" &&
      //           key !== "battery" &&
      //           key !== "id"
      //       );
      // console.log("Keys " + keys2)

      const detectedModeSensorVS121 = ModeDetector(keys);
      setSensorModeData(detectedModeSensorVS121);

      const newChartConfig: ChartConfig = keys.reduce((acc, key, index) => {
        acc[key] = {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          color: generateColor(index),
        };
        return acc;
      }, {} as ChartConfig);

      setDataChartConfig(newChartConfig);

      if (!keys.includes(activeChart!)) {
        setActiveChart(keys[0] || null);
      }
    }
  }, [chartData]);

  useEffect(() => {
    if (activeChart && chartData.length > 0) {
      const values = chartData.map((item) => item[activeChart]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      setMinMaxValues([min, max]);
    }
  }, [activeChart, chartData]);

  return (
    <>
      {sensorModeData?.mode === "LINE_CROSSING" ? (
        <LineCrossingView availableParams={chartData} />
      ) : sensorModeData?.mode === "PEOPLE_FLOW_ANALYSIS" ? (
        <PeopleFlowView availableParams={chartData} />
      ) : sensorModeData?.mode === "REGION_PEOPLE_COUNTING" ? (
        <RegionCountingView availableParams={chartData} />
      ) : (
        <Card className="w-full lg:h-[200px] xl:h-[250px] xl2:h-[300px] xl3:h-[370px] xl4:h-[450px] relative">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 justify-center gap-1 px-2 py-2 ">
              <>
                {keys.map((key) => (
                  <button
                    key={key}
                    data-active={activeChart === key}
                    className="flex flex-1 flex-col justify-center gap-1 border-t p-2 text-left data-[active=true]:bg-muted/50"
                    onClick={() => setActiveChart(key)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {getText(
                        dataChartConfig[key]?.label.toLowerCase(),
                        texts[language]
                      )}
                    </span>
                  </button>
                ))}
              </>
            </div>
          </CardHeader>
          <CardContent className="h-full w-full p-0">
            <ChartContainer
              config={dataChartConfig}
              className="h-full w-full relative"
            >
              <LineChart
                data={chartData}
                margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={
                    minMaxValues
                      ? [minMaxValues[0], minMaxValues[1]]
                      : ["auto", "auto"]
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("pt-BR", {
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                        })
                      }
                    />
                  }
                />
                {activeChart && (
                  <Line
                    dataKey={activeChart}
                    type="monotone"
                    stroke={dataChartConfig[activeChart]?.color}
                    strokeWidth={2}
                    dot={{ fill: "var(--color-desktop)" }}
                    activeDot={{ r: 6 }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Line>
                )}
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}
