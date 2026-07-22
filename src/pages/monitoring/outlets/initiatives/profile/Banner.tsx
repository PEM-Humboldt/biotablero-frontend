import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";

export function Banner() {
  const { initiativeInfo } = useInitiativeCTX();

  return !initiativeInfo ? null : (
    <div
      className="relative h-[120px] md:h-[260px] bg-primary"
      style={{
        ...(initiativeInfo?.bannerUrl
          ? { backgroundImage: `url('${initiativeInfo?.bannerUrl}')` }
          : {}),
        backgroundSize: "cover",
        backgroundPosition: "left center",
      }}
    >
      <div className="absolute top-2 md:top-6 right-2 md:right-6">
        <JoinInitiativeRequestButton />
      </div>
    </div>
  );
}
