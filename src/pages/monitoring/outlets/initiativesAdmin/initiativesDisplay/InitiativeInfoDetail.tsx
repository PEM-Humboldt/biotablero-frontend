import { getInitiative } from "pages/monitoring/api/monitoringAPI";
import { useEffect, useState } from "react";
import { InitiativeFullInfo } from "../types/initiativeData";

export function InitiativeInfoDetail({
  initiativeId,
}: {
  initiativeId: number;
}) {
  const [initiativeInfo, setInitiativeInfo] = useState<InitiativeFullInfo>();

  useEffect(() => {
    const getInitiativeInfo = async () => {
      const info = await getInitiative(initiativeId);
      setInitiativeInfo(info);
    };

    void getInitiativeInfo();
  }, [initiativeId]);

  return (
    <div>
      <h4>{initiativeId}</h4>
    </div>
  );
}
