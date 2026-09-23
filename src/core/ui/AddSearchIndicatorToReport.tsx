import { useReport } from "@hooks/useReport";
import { Button } from "@ui/shadCN/component/button";

export function AddSearchIndicatorToReportBtn({
  wrapperId,
}: {
  wrapperId: string;
}) {
  const { addSectionFromRegistryToReport } = useReport();
  return (
    <Button
      onClick={() => {
        addSectionFromRegistryToReport(wrapperId, "");
      }}
    ></Button>
  );
}
