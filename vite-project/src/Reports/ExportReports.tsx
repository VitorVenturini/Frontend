import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
import { Margin, usePDF } from "react-to-pdf";
import logoWecom from "../assets/10991348.jpg";
import { GraficoExport } from "@/components/charts/lineChart";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PdfProps {
  dados?: any[];

}

export function PdfGerate({ dados }: PdfProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  const openInNewTab = () => {
    const newWindow = window.open("", "_blank", "width=1200,height=900");
    

    if (newWindow) {
      // Cria um div para renderizar o React na nova janela
      const div = newWindow.document.createElement("div");
      newWindow.document.body.appendChild(div);

      // Renderiza o aplicativo React na nova janela
      const root = ReactDOM.createRoot(div);
      root.render(<ExampleUsePDF dados={dados}  toPDF={toPDF} />);

      // Estilização da nova janela (opcional)
      const style = newWindow.document.createElement("style");
      style.innerHTML = `
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        .card-container {
          margin-bottom: 20px;
        }
        .card-image {
          width: 100%;
          max-width: 800px;
        }
      `;
      newWindow.document.head.appendChild(style);
    }
  };

  const { toPDF } = usePDF({
    method: "save", // ou 'save', dependendo do comportamento desejado
    filename: "usepdf-example.pdf",
    page: { margin: Margin.MEDIUM, orientation: "portrait" },
    ref: targetRef,
  });

  return (
    <>
      {/* Conteúdo que será gerado no PDF */}
      <div ref={targetRef} style={{ display: "none" }}>
        <ExampleUsePDF dados={dados} />
      </div>

      {/* Botão para abrir o conteúdo em uma nova aba */}
      <Button variant="ghost" title="PDF" onClick={openInNewTab} disabled={dados?.length === 0 ? true : false}>
        <FileText />
      </Button>
    </>
  );
}

interface ExampleUsePDFProps extends PdfProps {
  toPDF?: () => void;
}

const ExampleUsePDF = ({ dados, toPDF }: ExampleUsePDFProps) => {
  return (
    <Container>
      <Card title="usePDF hook example" dados={dados} />
      {/* Botão para gerar o PDF */}
      <button onClick={toPDF}>Gerar PDF</button>
    </Container>
  );
};

type ContainerProps = {
  children: React.ReactNode;
};

const Container = ({ children }: ContainerProps) => {
  return <div className="container">{children}</div>;
};

interface CardProps extends PdfProps {
  title?: string;
}

const Card = ({ dados }: CardProps) => {
  
  return (
    <div className="card-container">
      {/* ALTERAR SOMENTE ABAIXO */}
      <img src={logoWecom} alt="Sample" className="card-image" />
      <h2 className="card-title text-black"></h2>
      <p className="card-paragraph text-black">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget
        libero quam. Fusce efficitur, lectus ac commodo maximus, neque augue
        tincidunt tellus, id dictum odio eros ac nulla.
      </p>
      <p className="card-paragraph text-black">
        Vivamus at urna sit amet justo auctor vestibulum ut nec nisl. Sed auctor
        augue eget libero tincidunt, ut dictum libero facilisis. Phasellus non
        libero at nisi eleifend tincidunt a eget ligula.
      </p>
      {/* Gráfico a ser exportado no PDF */}
      
      <GraficoExport chartData={dados as any} />
    </div>
  );
};
