import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { GraficoExport } from "@/components/charts/lineChartExport";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { host } from "@/App";

interface PdfProps {
  dados?: any[];
  keys?: string[];
  checkedKeys?: { [key: string]: boolean };
}

export function PdfGerate({ dados, keys }: PdfProps) {
  const targetRefs = useRef<HTMLDivElement[]>([]); // Array de referências para gráficos
  const [checkedKeys, setCheckedKeys] = useState<{ [key: string]: boolean }>({});
  const print = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (keys) {
      setCheckedKeys(keys.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }
  }, [keys]);

  // Função para enviar o conteúdo HTML como string para o servidor
  const sendPDFData = async (htmlString: string, fileName: string) => {
    try {
      const response = await fetch(host + "/api/generatePdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fileName,
          pdf: htmlString,
          landscape: false, // true or false
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
  const sendExcelData = async (htmlString: string, fileName: string) => {
    try {
      const response = await fetch(host + "/api/generateExcel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fileName,
          data: htmlString,
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
  // Função que será chamada para gerar e enviar o PDF
  const openInNewTab = async () => {
    const newWindow = window.open("", "_blank", "width=1200,height=900");

    if (newWindow) {
      const div = newWindow.document.createElement("div");
      newWindow.document.body.appendChild(div);

      const root = ReactDOM.createRoot(div); // Utilizando createRoot para React 18

      root.render(
        <div>
          <div ref={print} className="container">
            <div className="card-container max-h-[2350px] max-w-[2350px] h-full w-full" ref={() => targetRefs}>
              {/* Gerar gráficos para cada "key" filtrada */}
              {keys &&
                keys
                  .filter((key) => checkedKeys[key]) // Filtrar apenas as keys que foram "checked"
                  .map((key, index) => (
                    <div
                      key={index}
                      ref={(el) => (targetRefs.current[index] = el!)} // Salva a referência de cada gráfico
                      className="page-break max-h-[2450px] max-w-[2450px] h-full w-full"
                    >
                      <GraficoExport
                        chartData={dados?.filter(
                          (item) => item[key] !== undefined
                        ) || []}
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
        dados && dados[0]?.sensor_name ? dados[0].sensor_name : "sensor";

      // Obtenção da data e hora atuais
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getFullYear()).slice(-2)}`; // DD-MM-AA
      const formattedTime = `${String(currentDate.getHours()).padStart(2, "0")}${String(
        currentDate.getMinutes()
      ).padStart(2, "0")}${String(currentDate.getSeconds()).padStart(2, "0")}`; // HH:MM:SS

      const fileName = `${sensorName}_${formattedDate}_${formattedTime}`;

      // Espera o conteúdo carregar completamente
      setTimeout(() => {
        // Extrair o HTML gerado e enviar via POST
        const htmlContent = newWindow.document.documentElement.outerHTML;
        sendPDFData(htmlContent, fileName.replace(' ', ""));
        
        // Fechar a nova janela após enviar o HTML
        // setTimeout(() => {
        //   newWindow.close();
        // }, 2000); // Fechar após 2 segundos (opcional)
      }, 2000); // Espera 2 segundos para garantir que o conteúdo esteja renderizado
    }
  };

  const extractedKeys = keys?.filter(
    (key) => !["date", "sensor_name", "deveui", "id"].includes(key)
  );

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

            <Button variant="ghost" title="PDF" onClick={openInNewTab}>
              <FileText />
            </Button>
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
    </>
  );
}

