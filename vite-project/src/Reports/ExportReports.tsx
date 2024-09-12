import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client"; // Certifique-se de importar corretamente
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { GraficoExport } from "@/components/charts/lineChartExport";
import logoWecom from "../assets/10991348.jpg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface PdfProps {
  dados?: any[];
  keys?: string[];
  checkedKeys?: { [key: string]: boolean };
}

export function PdfGerate({ dados, keys }: PdfProps) {
  const targetRefs = useRef<HTMLDivElement[]>([]); // Array de referências para gráficos
  const [checkedKeys, setCheckedKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (keys) {
      setCheckedKeys(
        keys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
    }
  }, [keys]);

  const generatePDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");

    // Obtenção do sensor_name do primeiro item de dados
    const sensorName = dados && dados[0]?.sensor_name ? dados[0].sensor_name : "sensor";

    // Obtenção da data e hora atuais
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
    const formattedTime = `${String(currentDate.getHours()).padStart(2, "0")}-${String(
      currentDate.getMinutes()
    ).padStart(2, "0")}-${String(currentDate.getSeconds()).padStart(2, "0")}`;

    const fileName = `${sensorName}_${formattedDate}_${formattedTime}.pdf`;

    for (let i = 0; i < targetRefs.current.length; i++) {
      const input = targetRefs.current[i];

      if (input) {
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        const imgWidth = 297; // Largura em mm para A4 no modo paisagem
        const pageHeight = 210; // Altura em mm para A4 no modo paisagem
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

        // Adiciona uma nova página, exceto no último gráfico
        if (i < targetRefs.current.length - 1) {
          doc.addPage();
        }
      }
    }
    useEffect(() => {
      if (keys) {
        setCheckedKeys(
          keys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
      }
    }, [keys]);

    doc.save(fileName); // Usar o nome de arquivo dinâmico
  };
  const extractedKeys = keys?.filter(
    (key) => !["date", "sensor_name", "deveui", "id"].includes(key)
  );
  const handleCheckedChange = (key: string, checked: boolean) => {
    setCheckedKeys((prev) => ({ ...prev, [key]: checked }));
  };
  const openInNewTab = async () => {
    const newWindow = window.open("", "_blank", "width=1200,height=900");

    if (newWindow) {
      const div = newWindow.document.createElement("div");
      newWindow.document.body.appendChild(div);

      const root = ReactDOM.createRoot(div); // Utilizando createRoot para React 18

      root.render(
        <div>
          <div className="container">
            <div className="card-container">
              <img src={logoWecom} alt="Sample" className="card-image" />
              <h2 className="card-title text-black">usePDF Example</h2>
              <p className="card-paragraph text-black">
                Vivamus at urna sit amet justo auctor vestibulum ut nec nisl.
              </p>
              {/* Gerar gráficos para cada "key" filtrada */}
              {keys &&
                keys
                  .filter((key) => checkedKeys[key]) // Filtrar apenas as keys que foram "checked"
                  .map((key, index) => (
                    <div
                      key={index}
                      ref={(el) => (targetRefs.current[index] = el!)} // Salva a referência de cada gráfico
                      className="page-break"
                    >
                      <GraficoExport
                        chartData={dados as any}
                        checkedKeys={{ [key]: true }} // Passar a key específica
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      );

      newWindow.document.head.appendChild(
        document.createElement("style")
      ).textContent = `
        body { font-family: Arial, sans-serif; margin: 20px; }
        .card-image { width: 100%; max-width: 800px; }
        .page-break { page-break-before: always; }
      `;

      setTimeout(() => generatePDF(), 3000); // Gera o PDF após 1 segundo para garantir o carregamento
      setTimeout(() => newWindow.close(), 5000); // Fecha a aba após 2 segundos
    }
  };
  // Função para alternar o estado "checked" de uma chave

  return (
    <>
    <Popover>
        <PopoverTrigger
          asChild
          className="flex justify-between align-middle items-center"
        >
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
            >
              <FileText />
            </Button>
          </div>
      {extractedKeys?.map((key) => (
            <div className="flex gap-2 items-center">
              <Checkbox
                id={key}
                checked={checkedKeys[key] || false} // Usa o estado "checkedKeys"
                onCheckedChange={(checked) => handleCheckedChange(key, checked)}
              >
                {" "}
              </Checkbox>
              <label>{key}</label>
            </div>
          ))}
      <div style={{ display: "none" }}>
        <div className="container">
          <div className="card-container">
            <img src={logoWecom} alt="Sample" className="card-image" />
            <h2 className="card-title text-black">usePDF Example</h2>
            <p className="card-paragraph text-black">
              Vivamus at urna sit amet justo auctor vestibulum ut nec nisl.
            </p>
            {/* Gerar gráficos para cada "key" filtrada */}
            {keys &&
              keys
                .filter((key) => checkedKeys[key]) // Filtrar apenas as keys que foram "checked"
                .map((key, index) => (
                  <div
                    key={index}
                    ref={(el) => (targetRefs.current[index] = el!)} // Salva a referência de cada gráfico
                    className="page-break"
                  >
                    <GraficoExport
                      chartData={dados as any}
                      checkedKeys={{ [key]: true }} // Passar a key específica
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
      </PopoverContent>
      </Popover>
    </>
  );
}
