import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";

export function IndicatorCard() {
  const { currentIndicator } = useIndicatorsCTX();

  return (
    <>
      <header className="bg-primary p-4">
        Nombre del indicador, fecha de actualización, opciones /
        {currentIndicator ? currentIndicator.type.name : "pailas"}
      </header>
      <div className="flex flex-col lg:flex-row">
        <div className="bg-primary/50 flex-2 aspect-3/2">indicador</div>
        <div className="bg-primary/70 flex-1">descripcion</div>
      </div>

      <div className="bg-primary/30">tabs</div>
    </>
  );
}
