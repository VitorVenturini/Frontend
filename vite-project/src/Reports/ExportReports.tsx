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
import { useAccount } from "@/components/account/AccountContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import LogoCore from "../assets/Vector.svg";

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
  const account = useAccount();
  const { language } = useLanguage();
  const [isLoadingPdf, setIsLoadingPDf] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  useEffect(() => {
    if (dataReport.keys) {
      setCheckedKeys(
        dataReport.keys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
    }
  }, [dataReport.keys]);

  // Função para enviar o conteúdo HTML como string para o servidor
  const sendPDFData = async (
    htmlString: string,
    fileName: string,
    landscape: boolean
  ) => {
    try {
      setIsLoadingPDf(true);
      const response = await fetch(host + "/api/generatePdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": account.accessToken || "",
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
        setIsLoadingPDf(false);
      } else {
        console.error("Erro ao enviar o PDF.");
        setIsLoadingPDf(false);
      }
    } catch (error) {
      console.error("Erro ao enviar o PDF:", error);
      setIsLoadingPDf(false);
    }
  };
  const sendExcelData = async () => {
    try {
      setIsLoadingTable(true);
      const response = await fetch(host + "/api/generateExcel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": account.accessToken || "",
        },
        body: JSON.stringify({
          name: "TesteExport",
          data:
            dataReport?.table.length === 0
              ? dataReport?.chart
              : dataReport?.table,
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
        setIsLoadingTable(false);
      } else {
        console.error("Erro ao enviar o PDF.");
        setIsLoadingTable(false);
      }
    } catch (error) {
      console.error("Erro ao enviar o PDF:", error);
      setIsLoadingTable(false);
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
  const downloadTableToPdf = async () => {
    // Encontra o elemento com o atributo data-print="print"
    const printDiv = document.querySelector('[data-print="print"]');

    if (printDiv) {
      // Pega o conteúdo HTML da div
      let htmlContent = printDiv.innerHTML;

      // Adiciona estilos personalizados para a tabela
      const tableStyles = `
        <style>
          h4 {
          margin: 20px 0 0 0;
          width: 100%;
          text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse; /* Para unir as bordas */
          }
          th, td {
            border: 1px solid black; /* Adiciona bordas entre as células */
            text-align: center; /* Centraliza o texto nas células */
            padding: 8px; /* Adiciona espaçamento interno */
          }
          th {
            background-color: #f2f2f2; /* Cor de fundo para o cabeçalho */
          }
        </style>
      `;

      // Insere o estilo no HTML antes do conteúdo da tabela
      htmlContent = tableStyles + htmlContent;

      console.log(htmlContent); // Verificar o conteúdo estilizado

      // Obtenção do sensor_name do primeiro item de dados
      const sensorName =
        dataReport.chart && dataReport.chart[0]?.sensor_name
          ? dataReport.chart[0].sensor_name
          : "Relatório";

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
    <div className="flex align-middle mr-2 ml-2">
      {dataReport.table?.length !== 0 ? (
        <Button
          variant="ghost"
          title="Tabela"
          onClick={downloadTableToPdf}
          size="icon"
          disabled={dataReport.table?.length === 0 && isLoadingPdf}
        >
          {isLoadingPdf == true ? (
            <div>
              <img src={LogoCore} className="h-6 animate-spin" />
            </div>
          ) : (
            <FileText />
          )}
        </Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={
                dataReport.chart?.length === 0 && dataReport.table?.length === 0
              }
            >
              <FileText />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-56">
            <div className="flex justify-between items-center">
              {dataReport.chart?.length !== 0 ? (
                <h1>{texts[language].filter}</h1>
              ) : (
                <h1>{texts[language].export}</h1>
              )}

              <div>
                {dataReport.chart?.length !== 0 && (
                  <Button
                    variant="ghost"
                    title="Grafico"
                    size="icon"
                    onClick={openInNewTabChart}
                    disabled={dataReport.chart?.length === 0}
                  >
                    <LineChart />
                  </Button>
                )}
              </div>
            </div>
            {dataReport.chart?.length !== 0 &&
              extractedKeys?.map((key) => (
                <div className="flex gap-2 items-center" key={key}>
                  <Checkbox
                    id={key}
                    checked={checkedKeys[key] || false} // Usa o estado "checkedKeys"
                    onCheckedChange={(checked) =>
                      setCheckedKeys((prev) => ({
                        ...prev,
                        [key]: checked as any,
                      }))
                    }
                  >
                    {" "}
                  </Checkbox>
                  <label>{key}</label>
                </div>
              ))}
          </PopoverContent>
        </Popover>
      )}

      <Button
        variant="ghost"
        size="icon"
        disabled={
          dataReport.chart?.length === 0 && dataReport.table?.length === 0 && !isLoadingTable 
        }
        onClick={sendExcelData}
      >
        {isLoadingTable == true ? (
          <div>
            <img src={LogoCore} className="h-6 animate-spin" />
          </div>
        ) : (
          <Sheet />
        )}
      </Button>
    </div>
  );
}
