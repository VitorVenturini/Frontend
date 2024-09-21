import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/components/ui/button";
import { FileText, Sheet, LineChart } from "lucide-react";
import { GraficoExport } from "@/components/charts/lineChartExport";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { host } from "@/App";
import { useData } from "./DataContext";
import ColumnsReports from "./collumnsReports";

export interface PdfProps {
  filTable: any[];
  checkedKeys?: { [key: string]: boolean };
}

export function PdfGerate() {
  const { dataReport } = useData();
  const targetRefs = useRef<HTMLDivElement[]>([]); // Array de referências para gráficos
  const [checkedKeys, setCheckedKeys] = useState<{ [key: string]: boolean }>(
    {}
  );
  const print = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (dataReport.keys) {
      setCheckedKeys(
        dataReport.keys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
    }
  }, [dataReport.keys]);

  // Função para enviar o conteúdo HTML como string para o servidor
  const sendPDFData = async (htmlString: string, fileName: string, landscape: boolean) => {
    try {
      const response = await fetch(host + "/api/generatePdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fileName,
          pdf: htmlString,
          landscape: landscape, // true or false
        }),
      });

      if (response.ok) {
        const blob = await response.blob(); // Obtém o PDF como um blob
        const url = window.URL.createObjectURL(blob); // Cria um URL temporário para o blob

        // Cria um link temporário para o download do PDF
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName + ".pdf"; // Define o nome do arquivo de download
        document.body.appendChild(a);
        a.click(); // Simula um clique no link para iniciar o download

        // Remove o link após o download
        a.remove();
        window.URL.revokeObjectURL(url); // Limpa o URL temporário

        console.log("PDF enviado e download iniciado com sucesso!");
      } else {
        console.error("Erro ao enviar o PDF.");
      }
    } catch (error) {
      console.error("Erro ao enviar o PDF:", error);
    }
  };
  const sendExcelData = async () => {
    try {
      const response = await fetch(host + "/api/generateExcel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "TesteExport",
          data: dataReport.table,
        }),
      });

      if (response.ok) {
        const blob = await response.blob(); // Obtém o PDF como um blob
        const url = window.URL.createObjectURL(blob); // Cria um URL temporário para o blob

        // Cria um link temporário para o download do PDF
        const a = document.createElement("a");
        a.href = url;
        a.download = "TesteExport" + ".xlsx"; // Define o nome do arquivo de download
        document.body.appendChild(a);
        a.click(); // Simula um clique no link para iniciar o download

        // Remove o link após o download
        a.remove();
        window.URL.revokeObjectURL(url); // Limpa o URL temporário

        console.log("PDF enviado e download iniciado com sucesso!");
      } else {
        console.error("Erro ao enviar o PDF.");
      }
    } catch (error) {
      console.error("Erro ao enviar o PDF:", error);
    }
  };
  // Função que será chamada para gerar e enviar o PDF
  const openInNewTabChart = async () => {
    const newWindow = window.open("", "_blank", "width=1200,height=900");

    if (newWindow) {
      const div = newWindow.document.createElement("div");
      newWindow.document.body.appendChild(div);

      const root = ReactDOM.createRoot(div); // Utilizando createRoot para React 18

      root.render(
        <div>
          <div ref={print} className="container">
            <div
              className="card-container max-h-[2350px] max-w-[2350px] h-full w-full"
              ref={() => targetRefs}
            >
              {/* Gerar gráficos para cada "key" filtrada */}
              {dataReport.keys &&
                dataReport.keys
                  .filter((key) => checkedKeys[key]) // Filtrar apenas as keys que foram "checked"
                  .map((key, index) => (
                    <div
                      key={index}
                      ref={(el) => (targetRefs.current[index] = el!)} // Salva a referência de cada gráfico
                      className="page-break max-h-[2450px] max-w-[2450px] h-full w-full"
                    >
                      <GraficoExport
                        chartData={
                          dataReport.chart?.filter(
                            (item) => item[key] !== undefined
                          ) || []
                        }
                        checkedKeys={{ [key]: true }} // Passa as checkedKeys corretamente
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
        .card-image { width: 100%; max-width: 2400px; }
        .page-break { page-break-before: always; }
      `;

      // Obtenção do sensor_name do primeiro item de dados
      const sensorName =
        dataReport.chart && dataReport.chart[0]?.sensor_name
          ? dataReport.chart[0].sensor_name
          : "sensor";

      // Obtenção da data e hora atuais
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(
        currentDate.getFullYear()
      ).slice(-2)}`; // DD-MM-AA
      const formattedTime = `${String(currentDate.getHours()).padStart(
        2,
        "0"
      )}${String(currentDate.getMinutes()).padStart(2, "0")}${String(
        currentDate.getSeconds()
      ).padStart(2, "0")}`; // HH:MM:SS

      const fileName = `${sensorName}_${formattedDate}_${formattedTime}`;

      // Espera o conteúdo carregar completamente
      setTimeout(() => {
        // Extrair o HTML gerado e enviar via POST
        const htmlContent = newWindow.document.documentElement.outerHTML;
        sendPDFData(htmlContent, fileName.replace(" ", ""), true);

        // Fechar a nova janela após enviar o HTML
        setTimeout(() => {
          newWindow.close();
        }, 3000); // Fechar após 2 segundos (opcional)
      }, 2000); // Espera 2 segundos para garantir que o conteúdo esteja renderizado
    }
  };
  const openInNewTabTable = async () => {
    // Encontra o elemento com o atributo data-print="print"
    const printDiv = document.querySelector('[data-print="print"]');
  
    if (printDiv) {
      // Pega o conteúdo HTML da div
      const htmlContent = printDiv.innerHTML;
      console.log(htmlContent);
  
      // Obtenção do sensor_name do primeiro item de dados
      const sensorName =
        dataReport.chart && dataReport.chart[0]?.sensor_name
          ? dataReport.chart[0].sensor_name
          : "sensor";
  
      // Obtenção da data e hora atuais
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getFullYear()).slice(-2)}`; // DD-MM-AA
      const formattedTime = `${String(currentDate.getHours()).padStart(2, "0")}${String(
        currentDate.getMinutes()
      ).padStart(2, "0")}${String(currentDate.getSeconds()).padStart(2, "0")}`; // HH:MM:SS
  
      const fileName = `${sensorName}_${formattedDate}_${formattedTime}`;
  
      // Envia o HTML capturado para a função que lida com o envio do PDF
      sendPDFData(htmlContent, fileName.replace(" ", ""), false);
    } else {
      console.error("Elemento com data-print='print' não encontrado.");
    }
  
    // Fechar a nova janela após enviar o HTML (opcional)
    // setTimeout(() => {
    //   newWindow.close();
    // }, 3000); // Fechar após 2 segundos
  };
  
  const extractedKeys = dataReport.keys?.filter(
    (key) => !["date", "sensor_name", "deveui", "id"].includes(key)
  );

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            disabled={
              dataReport.chart?.length === 0 && dataReport.table?.length === 0
            }
          >
            <FileText />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-56">
          <div className="flex justify-between items-center">
            <h1>Filtro</h1>
            <div>
              <Button
                variant="ghost"
                title="Grafico"
                onClick={openInNewTabChart}
                disabled={dataReport.chart?.length === 0}
              >
                <LineChart />
              </Button>
              <Button
                variant="ghost"
                title="Tabela"
                onClick={openInNewTabTable}
                disabled={dataReport.table?.length === 0}
              >
                <Sheet />
              </Button>
            </div>
          </div>
          {extractedKeys?.map((key) => (
            <div className="flex gap-2 items-center" key={key}>
              <Checkbox
                id={key}
                checked={checkedKeys[key] || false} // Usa o estado "checkedKeys"
                onCheckedChange={(checked) =>
                  setCheckedKeys((prev) => ({ ...prev, [key]: checked as any }))
                }
              >
                {" "}
              </Checkbox>
              <label>{key}</label>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        disabled={dataReport.table?.length === 0}
        onClick={sendExcelData}
      >
        <Sheet />
      </Button>
    </>
  );
}
