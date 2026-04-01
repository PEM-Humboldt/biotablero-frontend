import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import backgroundImage from "pages/home/assets/biotablero-slider.webp";

export function HeaderTS() {
  const { initiativeInfo } = useInitiativeCTX();

  const bannerUrl = (initiativeInfo?.bannerUrl as string) || backgroundImage;

  return (
    <header
      className="relative w-full h-[120px] md:h-[260px] flex items-center justify-center overflow-hidden bg-primary"
      style={{
        backgroundImage: `url('${bannerUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 -bg-linear-300 from-primary to-transparent mix-blend-color" />

      <div className="w-full max-w-[1600px] p-4 z-10 text-3xl md:text-5xl font-bold text-primary-foreground">
        <div className="w-full max-w-[500px] text-balance">
          Juntos construimos más historias que transforman iniciativas.
        </div>
      </div>
    </header>
  );
}
