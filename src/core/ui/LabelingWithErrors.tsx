import { TriangleAlert } from "lucide-react";
import type { AriaRole, ReactNode } from "react";
import { cn } from "@ui/shadCN/lib/utils";

/**
 * Renders a label and its associated validation errors.
 *
 * Specifically designed to work with `aria-describedby` in input fields.
 * Uses a CSS selector `has-[.sr-only]` to handle visually hidden labels.
 *
 * @param htmlFor - The ID of the input field this label is for.
 * @param errID - The ID that will be assigned to the error list for accessibility linking.
 * @param - validationErrors Array of error messages to display.
 * @param - children The label text or content.
 */
export function LabelAndErrors({
  htmlFor,
  errID,
  validationErrors,
  children,
  className,
}: {
  htmlFor: string;
  errID: string;
  validationErrors: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-0 flex flex-wrap gap-x-2 items-baseline text-base",
        className,
      )}
    >
      <label htmlFor={htmlFor} className="w-full ">
        {children}
      </label>

      <ErrorsList errId={errID} errorItems={validationErrors} />
    </div>
  );
}

/**
 * Renders a form fieldset Legend and its associated validation errors.
 * Specifically designed to work with `aria-describedby` in input fields.
 *
 * @param validationErrors - Array of error messages to display.
 * @param classname - Some added classes
 * @param children - The text or content for the legend.
 */
export function LegendAndErrors({
  validationErrors,
  className,
  children,
}: {
  validationErrors: string[];
  className?: string;
  children: ReactNode;
}) {
  return (
    <legend className="contents">
      <div
        className={cn(
          "p-0 flex flex-wrap gap-2 text-primary items-baseline text-lg",
          className,
        )}
      >
        <span className="font-normal">{children}</span>

        <ErrorsList role="alert" errorItems={validationErrors} />
      </div>
    </legend>
  );
}

/**
 * Renders an accessible list of unique validation error messages.
 * This component manages accessibility attributes like ARIA roles and live regions.
 *
 * @param errId - Id used to link with inputs via `aria-describedby`.
 * @param errorItems - Array of strings containing the error messages to display.
 * @param className - Optional CSS classes for additional styling.
 * @param role - The ARIA role for the list. Defaults to "status" for non-disruptive updates.
 */
export function ErrorsList({
  errId,
  errorItems,
  className,
  role = "status",
}: {
  errId?: string;
  errorItems: string[];
  className?: string;
  role?: AriaRole;
}) {
  return errorItems.length === 0 ? null : (
    <ul
      id={errId}
      className={cn(className !== undefined ? className : "contents")}
      role={role}
      aria-live="polite"
    >
      {[...new Set(errorItems)].map((errorTxt) => (
        <li
          key={errorTxt}
          className="inline-flex items-baseline text-accent gap-1 text-base"
        >
          <TriangleAlert
            size="1rem"
            className="self-center shrink-0"
            aria-hidden="true"
          />
          <span className="font-normal">{errorTxt}</span>
        </li>
      ))}
    </ul>
  );
}
