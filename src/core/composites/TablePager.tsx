import { type ReactNode } from "react";

type ButtonData = {
  text: string;
  icon?: string | ReactNode;
};

type PagerButtons = {
  prev: ButtonData;
  next: ButtonData;
  first?: ButtonData;
  last?: ButtonData;
};

type PagerTexts = {
  registryPageName: string;
  registryPageOf: string;
  gotoAltText?: string;
};

type PagerProps = {
  currentPage: number;
  recordsAvailable: number;
  buttons: PagerButtons;
  texts: PagerTexts;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  paginated: number | null;
};

/**
 * Renders a paginated navigation control for tables or lists.
 * Supports numbered pages, next/previous navigation, and optional first/last buttons.
 *
 * @param {PagerProps} props - Pagination configuration.
 * @param {number} props.recordsAvailable - Total number of available records.
 * @param {number} props.recordsPerPage - Number of records per page.
 * @param {number} props.currentPage - The currently active page.
 * @param {(page: number) => void} props.onPageChange - Callback triggered when the user selects a new page.
 * @param {number | null} [props.paginated] - Number of visible page buttons around the current page.
 *   - If `0`, all pages are shown.
 *   - If null, only the current page is displayed as text.
 * @param {object} props.buttons - Optional button configurations (`first`, `prev`, `next`, `last`), each with `icon` and `text`.
 * @param {object} props.texts - Customizable text labels (e.g., `registryPageName`, `registryPageOf`, `gotoAltText`).
 *
 * @returns {JSX.Element | null} Pagination controls, or `null` if only one page exists.
 *
 * @example
 * ```tsx
 * <TablePager
 *   currentPage={2}
 *   recordsAvailable={100}
 *   recordsPerPage={10}
 *   onPageChange={(page) => setPage(page)}
 *   paginated={3}
 *   buttons={{
 *     prev: { icon: "<", text: "Prev" },
 *     next: { icon: ">", text: "Next" },
 *   }}
 *   texts={{
 *     registryPageName: "Page",
 *     registryPageOf: "of",
 *   }}
 * />
 * ```
 */
export function TablePager({
  currentPage,
  recordsAvailable,
  buttons,
  texts,
  recordsPerPage,
  onPageChange,
  paginated,
}: PagerProps) {
  const totalPages = Math.ceil(recordsAvailable / recordsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleGoToPage = (page: number) => {
    onPageChange(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pages = getVisiblePageIndexes(currentPage, totalPages, paginated);

  return totalPages <= 1 ? null : (
    <div className="pagination-controls" style={{ marginTop: "1rem" }}>
      {buttons.first && (
        <PagerButton
          icon={buttons.first.icon}
          text={buttons.first.text}
          onClick={() => handleGoToPage(1)}
          disabled={currentPage === 1}
        />
      )}

      <PagerButton
        onClick={handlePrevious}
        disabled={currentPage === 1}
        icon={buttons.prev.icon}
        text={buttons.prev.text}
      />

      {pages ? (
        pages.map((page) => (
          <PagerButton
            key={`page_${page}`}
            onClick={() => handleGoToPage(page)}
            disabled={currentPage === page}
            text={texts.gotoAltText ?? ""}
            icon={page}
          />
        ))
      ) : (
        <span style={{ margin: "0 1rem" }}>
          {texts.registryPageName} {currentPage} {texts.registryPageOf}{" "}
          {totalPages}
        </span>
      )}

      <PagerButton
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        icon={buttons.next.icon}
        text={buttons.next.text}
      />

      {buttons.last && (
        <PagerButton
          onClick={() => handleGoToPage(totalPages)}
          disabled={currentPage >= totalPages}
          icon={buttons.last.icon}
          text={buttons.last.text}
        />
      )}
    </div>
  );
}

function getVisiblePageIndexes(
  currentPage: number,
  totalPages: number,
  paginated: number | null,
): number[] | null {
  if (typeof paginated !== "number") {
    return null;
  }

  if (paginated === 0) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const visibleCount = paginated * 2 + 1;

  let start = currentPage - paginated;
  let end = currentPage + paginated;

  if (start < 1) {
    const shift = 1 - start;
    start = 1;
    end = Math.min(totalPages, end + shift);
  }

  if (end > totalPages) {
    const shift = end - totalPages;
    end = totalPages;
    start = Math.max(1, start - shift);
  }
  const length = Math.min(visibleCount, end - start + 1);
  return Array.from({ length }, (_, i) => start + i);
}

function PagerButton({
  text,
  icon,
  onClick,
  disabled,
}: {
  text: string;
  icon?: string | ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button type="button" onClick={() => onClick()} disabled={disabled}>
      {icon ? (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{icon}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
}
