import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { StrValidator } from "@utils/strValidator";
import {
  type ReactNode,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { Button } from "@ui/shadCN/component/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { XIcon } from "lucide-react";

type KeywordInputProps = {
  keywordsList: string[];
  updateKeywordsList: (updatedKeywordsList: string[]) => void;
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
  errors: string[];
  setErrors: (errors: string[]) => void;
};

export function KeywordInput({
  keywordsList,
  updateKeywordsList,
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
  errors,
  setErrors,
}: KeywordInputProps): ReactNode {
  const [inputStr, setInputStr] = useState<string>("");

  const saveKeyword = (keyword: string) => {
    setErrors([]);

    const [cleanStr, inputErr] = new StrValidator(keyword)
      .sanitize()
      .isUniqueIn(new Set(keywordsList)).result;

    if (cleanStr.trim().length === 0) {
      setInputStr(""); // Limpiamos el input si solo había espacios
      return;
    }

    if (inputErr.length > 0) {
      setInputStr(keyword);
      setErrors(inputErr);
      return;
    }

    updateKeywordsList([...keywordsList, cleanStr]);
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
    if (keywordsList.length === 0) {
      return;
    }

    updateKeywordsList(keywordsList.filter((_, i) => i !== index));
    setErrors([]);
  };

  return (
    <div>
      <LabelAndErrors
        htmlFor="keywords"
        errID="errors_keywords"
        validationErrors={errors ?? []}
      >
        <div className="flex w-full justify-between text-primary font-normal px-2">
          <span>
            {inputTxt.label}
            <span className="sr-only">{inputTxt.sr}</span>
          </span>
          <span>
            {inputTxt.keywordCounter(keywordsList.length ?? 0, keywordsLimit)}
          </span>
        </div>
      </LabelAndErrors>

      <InputGroup>
        {keywordsList.length > 0 && (
          <InputGroupAddon align="block-start" className="p-2">
            <ul className="flex flex-wrap justify-start gap-2">
              {keywordsList.map((keyword, index) => (
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

        {keywordsLimit > keywordsList.length && (
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
            aria-invalid={errors.length > 0}
            aria-describedby={errors.length > 0 ? "errors_keywords" : undefined}
            disabled={keywordsList === null}
          />
        )}

        {source && source.length > 0 && (
          <datalist id="keywords_source">
            {source.map((s) => (
              <option value={s}></option>
            ))}
          </datalist>
        )}

        {inputLengthCount(inputStr, keywordMaxLength) && (
          <InputGroupAddon
            align="block-end"
            className={inputWarnColor(inputStr, keywordMaxLength)}
          >
            {inputLengthCount(inputStr, keywordMaxLength)}
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
