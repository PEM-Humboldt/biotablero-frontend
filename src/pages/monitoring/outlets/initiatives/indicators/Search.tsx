import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";

export function Search() {
  const { indicators } = useIndicatorsCTX();

  return (
    <div className="bg-accent flex-1 flex lg:flex-col max-h-60 lg:max-h-screen">
      <div className="bg-background/40 flex-1 lg:flex-none lg:aspect-3/2">
        Buscador
      </div>

      <div className="flex-1 flex flex-col p-2 gap-2 [&_span]:bg-background/30 overflow-auto scrollbar-custom">
        {indicators.map((indicator) => (
          <span>{indicator.type.name}</span>
        ))}
      </div>
    </div>
  );
}
