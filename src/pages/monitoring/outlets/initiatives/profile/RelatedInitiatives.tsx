import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRightCircle, Handshake } from "lucide-react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";
import { Button } from "@ui/shadCN/component/button";

import { getRelatedInitiatives } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { InitiativeRelated } from "pages/monitoring/types/stats";
import { uiText } from "pages/monitoring/outlets/initiatives/layout/uiText";

export function RelatedInitiatives() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeRelated[]>([]);

  useEffect(() => {
    const fetchRelatedInitiatives = async () => {
      setIsLoading(true);
      setInitiatives([]);
      setErrors([]);

      const res = await getRelatedInitiatives();
      setIsLoading(false);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }
      setInitiatives(res);
    };

    void fetchRelatedInitiatives();
  }, []);

  return isLoading ? (
    <LoadingDiv />
  ) : (
    <>
      <ErrorsList errorItems={errors} />

      <div className="flex gap-2 max-w-[1200px] mx-auto px-4 pb-4 md:px-8 md:pb-8">
        <Handshake
          className="size-[34px] -translate-y-1 text-accent min-w-10"
          strokeWidth={1.5}
        />
        <div className="pb-2 lg:pb-4 w-full">
          <h4 className="text-3xl font-bold">
            {uiText.profile.relatedInitiatives.title}
          </h4>

          <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 lg:gap-4 w-full">
            {initiatives.map((initiative) => {
              const initiativeResume =
                initiative.description.length > 100
                  ? `${initiative.description.slice(0, 96)}...`
                  : initiative.description;

              return (
                <li
                  key={`relatedInitiative_${initiative.id}`}
                  className="flex flex-col justify-between shadow-2xl rounded-lg p-2 lg:p-4 **:m-0 outline outline-transparent hover:outline-primary transition-colors duration-300"
                >
                  <div>
                    <h5>
                      {initiative?.shortName ? (
                        <abbr className="no-underline" title={initiative.name}>
                          {initiative.shortName}
                        </abbr>
                      ) : (
                        initiative.name
                      )}
                    </h5>
                    <p className="text-balance">
                      {initiativeResume.replaceAll("\n", " ")}
                    </p>
                  </div>
                  <Button variant="link" className="self-end" asChild>
                    <Link
                      to={`/Monitoreo/Iniciativas/${initiative.id}`}
                      aria-label={uiText.profile.relatedInitiatives.goToBtn.sr}
                      title={uiText.profile.relatedInitiatives.goToBtn.title}
                    >
                      {uiText.profile.relatedInitiatives.goToBtn.label}
                      <ChevronRightCircle className="text-accent" />
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
