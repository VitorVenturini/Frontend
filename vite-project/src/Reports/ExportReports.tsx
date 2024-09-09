import React from "react";
import { Margin, usePDF } from "react-to-pdf";

import { Button } from "@/components/ui/button";
import logoWecom from "../assets/10991348.jpg";

export const ExampleUsePDF = () => {
  const { toPDF, targetRef } = usePDF({
    method: "open",
    filename: "usepdf-example.pdf",
    page: { margin: Margin.MEDIUM },
  });

  return (
    <Container>
      <Button onClick={()=>toPDF}>Download PDF</Button>
      <div ref={targetRef}>
        <Card title="usePDF hook example" />
      </div>
    </Container>
  );
};

type ContainerProps = {
  children: React.ReactNode;
};

const Container = ({ children }: ContainerProps) => {
  return <div className="container">{children}</div>;
};

interface CardProps {
  title?: string;
}

const Card = ({
  title = "Welcome to Our Sample Component",
}: CardProps) => {
  return (
    <div className="card-container">
      <img
        src={logoWecom}
        alt="Sample"
        className="card-image"
      />
      <h2 className="card-title text-black">{title}</h2>
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
    </div>
  );
};