import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

export function TextAndErrorForLabel({
  validationErrors,
  children,
}: {
  validationErrors: string[];
  children: ReactNode;
}) {
  const areErrors = validationErrors.length > 0;

  return (
    <div className="flex items-baseline flex-wrap">
      <span className={areErrors ? " font-bold" : ""}>{children}</span>{" "}
      {areErrors && (
        <ul className="flex flex-wrap mx-2 pb-1">
          {validationErrors.map((errorTxt) => (
            <li
              key={errorTxt}
              className="text-secondary font-semibold mx-1 p-0 inline-flex items-baseline gap-0.5"
            >
              <TriangleAlert size={"1rem"} className="translate-y-1" />
              {errorTxt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
