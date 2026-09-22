import { useReport } from "@hooks/useReport";
import { Button } from "@ui/shadCN/component/button";

export function AddSearchIndicatorToReportBtn({
  wrapperId,
}: {
  wrapperId: string;
}) {
  const { setWrapperIdToCapture } = useReport();
  return (
    <Button
      onClick={() => {
        setWrapperIdToCapture(wrapperId);
      }}
    ></Button>
  );
}
