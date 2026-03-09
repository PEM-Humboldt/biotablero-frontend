import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { StrValidator } from "@utils/strValidator";
import {
  type ReactNode,
  type MutableRefObject,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
} from "react";

import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { XIcon } from "lucide-react";

type KeywordInputProps = {
  listStateRef: MutableRefObject<string[] | null>;
  separators?: string[];
  source?: string[];
  keywordsLimit: number;
  keywordMaxLength?: number;
  inputTxt: {
    label: string;
    placeholder: string;
    sr: string;
    keywordCounter: (currentAmount: number, total: number) => string;
  };
};

export function KeywordInput({
  listStateRef,
  source,
  separators = [","],
  keywordsLimit = 5,
  keywordMaxLength = 120,
  inputTxt = {
    label: "Palabras clave",
    placeholder: "Agrega una palabra oprimiendo [Enter]",
    sr: "presionia enter para añadir una palabra clave",
    keywordCounter: (currentAmount: number, total: number) =>
      `${currentAmount} de ${total} palabras clave`,
  },
}: KeywordInputProps): ReactNode {
  const [updateComponent, setUpdateComponent] = useState(0);
  const [inputStr, setInputStr] = useState<string>("");
  const [errors, setErrors] = useState<string[] | null>(null);

  useEffect(() => {
    if (!listStateRef.current || listStateRef.current.length === 0) {
      listStateRef.current = [];
    }
  }, [listStateRef]);

  const saveKeyword = (keyword: string) => {
    if (!listStateRef.current) {
      return;
    }
    setErrors(null);

    const [cleanStr, inputErr] = new StrValidator(keyword)
      .sanitize()
      .isUniqueIn(new Set(listStateRef.current)).result;

    if (cleanStr.trim().length === 0) {
      setInputStr(""); // Limpiamos el input si solo había espacios
      return;
    }

    if (inputErr.length > 0) {
      setInputStr(keyword);
      setErrors(inputErr);
      return;
    }

    listStateRef.current = [...new Set([...listStateRef.current, cleanStr])];
    setInputStr("");
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!separators.includes(value[value.length - 1])) {
      setInputStr(value);
      return;
    }

    saveKeyword(value.slice(0, value.length - 1));
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
    saveKeyword(inputStr);
  };

  const handleRemoveKeyword = (index: number) => {
    if (!listStateRef.current || listStateRef.current.length === 0) {
      return;
    }

    listStateRef.current.splice(index, 1);
    setErrors(null);
    setUpdateComponent((n) => n + 1);
  };

  return (
    listStateRef.current && (
      <div key={updateComponent} className="max-w-[400px]">
        <LabelAndErrors
          htmlFor="keywords"
          errID="errors_keywords"
          validationErrors={errors ?? []}
        >
          {inputTxt.label}
          <span className="sr-only">{inputTxt.sr}</span>
        </LabelAndErrors>

        <InputGroup>
          {listStateRef.current.length > 0 && (
            <InputGroupAddon align="block-start" className="p-2">
              <ul className="flex flex-wrap justify-start gap-2">
                {listStateRef.current.map((keyword, index) => (
                  <li
                    key={keyword}
                    className="flex pl-2 items-start bg-muted font-normal text-primary rounded"
                  >
                    <span className="pr-2 border-r border-r-muted-foreground/30">
                      {keyword}
                    </span>

                    <Button
                      variant="link"
                      className="w-6! h-6! text-primary"
                      onClick={() => handleRemoveKeyword(index)}
                    >
                      <XIcon className="" />
                    </Button>
                  </li>
                ))}
              </ul>
            </InputGroupAddon>
          )}

          {keywordsLimit > listStateRef.current.length && (
            <InputGroupInput
              name="keywords"
              id="keyword"
              type="text"
              value={inputStr}
              list="keywords_source"
              onChange={handleOnChange}
              onKeyDown={handleOnKeyDown}
              autoComplete="on"
              placeholder={inputTxt.placeholder}
              maxLength={keywordMaxLength}
              aria-invalid={errors !== null}
              aria-describedby={errors !== null ? "errors_keywords" : undefined}
              disabled={listStateRef.current === null}
            />
          )}

          {source && source.length > 0 && (
            <datalist id="keywords_source">
              {source.map((s) => (
                <option value={s}></option>
              ))}
            </datalist>
          )}

          <InputGroupAddon
            align="inline-end"
            className={cn("p-0!", inputWarnColor(inputStr, keywordMaxLength))}
          >
            {inputLengthCount(inputStr, keywordMaxLength)}
          </InputGroupAddon>
        </InputGroup>

        <div className="text-right">
          {inputTxt.keywordCounter(
            listStateRef.current?.length ?? 0,
            keywordsLimit,
          )}
        </div>
      </div>
    )
  );
}
