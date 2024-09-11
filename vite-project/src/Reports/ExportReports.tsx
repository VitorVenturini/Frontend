import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Margin, usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { GraficoExport } from "@/components/charts/lineChartExport";
import logoWecom from "../assets/10991348.jpg";

interface PdfProps {
  dados?: any[];
  keys?: string[];
  checkedKeys?: { [key: string]: boolean };
}

export function PdfGerate({ dados, keys }: PdfProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [checkedKeys, setCheckedKeys] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (keys) {
      setCheckedKeys(
        keys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
    }
  }, [keys]);

  const openInNewTab = () => {
    const newWindow = window.open("", "_blank", "width=1200,height=900");
    if (newWindow) {
      const div = newWindow.document.createElement("div");
      newWindow.document.body.appendChild(div);
      ReactDOM.createRoot(div).render(
        <ExampleUsePDF dados={dados} checkedKeys={checkedKeys || {}} toPDF={toPDF} />
      );
      newWindow.document.head.appendChild(
        document.createElement("style")
      ).textContent = `
        body { font-family: Arial, sans-serif; margin: 20px; }
        .card-image { width: 100%; max-width: 800px; }
      `;
    }
  };

  const { toPDF } = usePDF({
    method: "open",
    filename: "usepdf-example.pdf",
    page: { margin: Margin.MEDIUM, orientation: "portrait" },
    ref: targetRef,
  });

  const handleCheckedChange = (key: string, checked: boolean) => {
    setCheckedKeys((prev) => ({ ...prev, [key]: checked }));
  };

  const extractedKeys = keys?.filter(
    (key) => !["date", "sensor_name", "deveui", "id"].includes(key)
  );

  return (
    <>
      <div ref={targetRef} style={{ display: "none" }}>
        <ExampleUsePDF dados={dados} checkedKeys={checkedKeys || {}} />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" disabled={dados?.length === 0}>
            <FileText />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="flex justify-between items-center">
            <h1>Filtro</h1>

            <Button
              variant="ghost"
              title="PDF"
              onClick={openInNewTab}
              disabled={!dados?.length}
            >
              <FileText />
            </Button>
          </div>

          {extractedKeys?.map((key) => (
            <div key={key} className="flex gap-2 items-center">
              <Checkbox
                id={key}
                checked={checkedKeys[key] || false} 
                onCheckedChange={(checked) =>
                  handleCheckedChange(key, !!checked)
                }
              />
              <label htmlFor={key}>{key}</label>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}

const ExampleUsePDF = ({
  dados,
  checkedKeys,
  toPDF,
}: PdfProps & { toPDF?: () => void }) => (
  <Container>
    <Card dados={dados} checkedKeys={checkedKeys || {}} /> {/* Fallback para objeto vazio */}
    <button onClick={toPDF}>Gerar PDF</button>
  </Container>
);

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container">{children}</div>
);

const Card = ({ dados, checkedKeys }: PdfProps) => (
  <div className="flex">
    <img src={logoWecom} alt="Sample" className="card-image" />
    <h2 className="card-title text-black">usePDF Example</h2>
    <p className="card-paragraph text-black">
      Vivamus at urna sit amet justo auctor vestibulum ut nec nisl.
    </p>
    <GraficoExport chartData={dados as any} checkedKeys={checkedKeys || {}} />
  </div>
);
