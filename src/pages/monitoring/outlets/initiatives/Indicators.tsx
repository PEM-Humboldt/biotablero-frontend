export function Indicators() {
  return (
    <div className="flex flex-col lg:flex-row min-h-full">
      <div className="bg-accent flex-1 flex lg:flex-col max-h-60 lg:max-h-screen">
        <div className="bg-background/40 flex-1 lg:flex-none lg:aspect-3/2">
          Buscador
        </div>

        <div className="flex-1 flex flex-col p-2 gap-2 [&_span]:bg-background/30 [&_span]:min-h-[500px] overflow-auto scrollbar-custom">
          <span>item</span>
          <span>item</span>
          <span>item</span>
          <span>item</span>
        </div>
      </div>

      <main className="bg-grey-light flex-3">
        <header className="bg-primary p-4">
          Nombre del indicador, fecha de actualización, opciones
        </header>
        <div className="flex flex-col lg:flex-row">
          <div className="bg-primary/50 flex-2 aspect-3/2">indicador</div>
          <div className="bg-primary/70 flex-1">descripcion</div>
        </div>

        <div className="bg-primary/30">tabs</div>
      </main>
    </div>
  );
}
