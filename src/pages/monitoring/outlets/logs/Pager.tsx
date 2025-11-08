import { RECORDS_PER_PAGE } from "@config/monitoring";
import { uiText } from "pages/monitoring/outlets/logs/pager/layout/uiText";

type LogsPagerProps = {
  currentPage: number;
  recordsAvailable: number;
  onPageChange: (page: number) => void;
};
export function LogsPager({
  currentPage,
  recordsAvailable,
  onPageChange,
}: LogsPagerProps) {
  const totalPages = Math.ceil(recordsAvailable / RECORDS_PER_PAGE);
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return totalPages <= 1 ? null : (
    <div className="pagination-controls" style={{ marginTop: "1rem" }}>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        {uiText.prevBtn}
      </button>
      <span style={{ margin: "0 1rem" }}>
        {uiText.page} {currentPage} {uiText.of} {totalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage >= totalPages}>
        {uiText.nextBtn}
      </button>
    </div>
  );
}
