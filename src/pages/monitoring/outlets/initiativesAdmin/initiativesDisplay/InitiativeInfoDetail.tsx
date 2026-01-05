import { useEffect, useState } from "react";

export function InitiativeInfoDetail({
  initiativeId,
}: {
  initiativeId: number;
}) {
  const [initiativeInfo, setInitiativeInfo] = useState({});

  useEffect(() => {
    const getInitiativeInfo = async () => {
      const initiative = {};
    };

    void getInitiativeInfo();
  }, []);

  return (
    <>
      <div>
        <h4>{initiativeId}</h4>
      </div>
    </>
  );
}
