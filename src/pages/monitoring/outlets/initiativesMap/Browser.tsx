import { useNavigate, useParams } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import { getLocationsList } from "pages/monitoring/api/services/location";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useEffect, useMemo, useState } from "react";

export function Browser() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Record<number, string>>({});
  const { departmentId, initiativeId } = useParams();

  useEffect(() => {
    const fetchLocations = async () => {
      const locationList = await getLocationsList();
      if (isMonitoringAPIError(locationList)) {
        return {};
      }
      setLocations(
        locationList.reduce<Record<number, string>>((all, current) => {
          all[current.id] = current.name;
          return all;
        }, {}),
      );
    };

    void fetchLocations();
  }, []);

  return (
    <div className="absolute p-4 w-[25%] h-[50%] bg-background top-19 left-13 z-10 rounded-lg flex flex-col gap-4">
      <div className="flex gap-1 items-center h-10">
        {departmentId ? (
          <Button
            className="p-0"
            onClick={() => void navigate("/Monitoreo")}
            variant="link"
          >
            Colombia
          </Button>
        ) : (
          <span>Colombia</span>
        )}
        {initiativeId ? (
          <>
            <Button
              className="p-0"
              onClick={() =>
                void navigate(`/Monitoreo/Departamento/${departmentId}`)
              }
              variant="link"
            >
              {locations[Number(departmentId)] ?? ""}
            </Button>

            <Button
              className="p-0"
              onClick={() =>
                void navigate(`/Monitoreo/Iniciativas/${initiativeId}`)
              }
              variant="link"
            >
              Ir a la iniciativa
            </Button>
          </>
        ) : (
          <span>{locations[Number(departmentId)] ?? ""}</span>
        )}
      </div>
    </div>
  );
}
