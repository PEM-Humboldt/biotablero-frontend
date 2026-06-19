import { useNavigate, useParams } from "react-router";

import { Button } from "@ui/shadCN/component/button";

export function Browser({
  locationsById,
}: {
  locationsById: Record<number, string>;
}) {
  const navigate = useNavigate();
  const { departmentId, initiativeId } = useParams();

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
              {locationsById[Number(departmentId)] ?? ""}
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
          <span>{locationsById[Number(departmentId)] ?? ""}</span>
        )}
      </div>
    </div>
  );
}
