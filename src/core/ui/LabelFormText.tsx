import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

export function LabelFormText({
  validationErrors,
  children,
}: {
  validationErrors: string[];
  children: ReactNode;
}) {
  const areErrors = validationErrors.length > 0;
  return (
    <>
      <span className={areErrors ? "font-bold" : ""}>{children}</span>{" "}
      {areErrors && (
        <ul className="block mx-2 pb-1">
          {validationErrors.map((errorTxt) => (
            <li className="text-secondary font-semibold mx-1 text-sm p-0 inline-flex items-baseline gap-0.5">
              <TriangleAlert size={"1rem"} className="translate-y-1" />
              {errorTxt}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
