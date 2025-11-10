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
  className: string;
};

/**
 * Renders a paginated navigation control for tabular or list-based data.
 * Provides flexible navigation with numbered pages, previous/next controls, and optional first/last buttons.
 *
 * @param props - Pagination configuration.
 * @param props.recordsAvailable - Total number of available records in the dataset.
 * @param props.recordsPerPage - Number of records displayed per page.
 * @param props.currentPage - The currently active page number.
 * @param props.onPageChange - Callback executed when the user selects or navigates to a different page.
 * @param props.paginated - Controls how many page numbers are visible around the current page:
 *   - If `0`, all pages are shown.
 *   - If a positive number, limits the number of visible pages before and after the current page.
 *   - If omitted or `null`, only a textual summary (e.g., "Page 3 of 12") is displayed.
 * @param props.buttons - Button configuration for navigation elements.
 *   Each button includes:
 *   - `text`: the accessible label for screen readers.
 *   - `icon`: an icon, string, or ReactNode to visually represent the action.
 *   Supported button keys:
 *   - `first` and `last` (optional) for jumping to the beginning or end.
 *   - `prev` and `next` (required) for navigating between adjacent pages.
 * @param props.texts - Text labels used in pagination display:
 *   - `registryPageName`: label shown before the current page number.
 *   - `registryPageOf`: label separating the current and total page count.
 *   - `gotoAltText`: accessible label prefix for page number buttons.
 *
 * @returns Pagination controls as a JSX element, or `null` if only one page exists.
 */
export function TablePager({
  currentPage,
  recordsAvailable,
  buttons,
  texts,
  recordsPerPage,
  onPageChange,
  paginated,
  className,
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
    <div className={className}>
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
        <span>
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
