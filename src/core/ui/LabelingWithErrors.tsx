import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@ui/shadCN/lib/utils";

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
  const areErrors = validationErrors.length > 0;

  return (
    <div
      className={cn(
        "p-0 flex flex-wrap gap-x-2 items-baseline text-base",
        className,
      )}
    >
      <label htmlFor={htmlFor} className="has-[.sr-only]:sr-only">
        {children}
      </label>

      {areErrors && (
        <ul id={errID} className="contents">
          {validationErrors.map((errorTxt) => (
            <li
              key={errorTxt}
              className="inline-flex items-baseline text-accent gap-1"
            >
              <TriangleAlert
                size="1rem"
                className="translate-y-1"
                aria-hidden="true"
              />
              <span className="font-normal">{errorTxt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LegendAndErrors({
  validationErrors,
  className,
  children,
}: {
  validationErrors: string[];
  className?: string;
  children: ReactNode;
}) {
  const areErrors = validationErrors.length > 0;

  return (
    <legend className="contents">
      <div
        className={cn(
          "p-0 flex flex-wrap gap-2 items-baseline text-lg",
          className,
        )}
      >
        <span className="font-normal">{children}</span>

        {areErrors && (
          <ul role="alert" className="contents">
            {validationErrors.map((errorTxt) => (
              <li
                key={errorTxt}
                className="inline-flex items-baseline text-accent gap-1"
              >
                <TriangleAlert
                  size="1rem"
                  className="translate-y-1"
                  aria-hidden="true"
                />
                <span className="text-base font-normal">{errorTxt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </legend>
  );
}
