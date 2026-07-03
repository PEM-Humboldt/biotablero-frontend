import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRightCircle } from "lucide-react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";
import { Button } from "@ui/shadCN/component/button";

import { getRelatedInitiatives } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { InitiativeRelated } from "pages/monitoring/types/stats";

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
      <ul className="flex gap-2 lg:gap-4">
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
                <Link to={`/Monitoreo/Iniciativas/${initiative.id}`}>
                  Ir a la iniciativa
                  <ChevronRightCircle className="text-accent" />
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
