import {
  type ChangeEvent,
  type MutableRefObject,
  useEffect,
  useState,
} from "react";

import { Input } from "@ui/shadCN/component/input";
import { Textarea } from "@ui/shadCN/component/textarea";
import { LabelFormText } from "@ui/LabelText";

import type { InitiativeDataForm } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import type { GetStringKeys } from "pages/monitoring/types/monitoring";

type FormStringValues = GetStringKeys<InitiativeDataForm>;

export function InitiativeGeneralInfo({
  formDataRef,
  formErrors,
}: {
  formDataRef: MutableRefObject<InitiativeDataForm>;
  formErrors: { [key: string]: string[] };
}) {
  const [formValues, setFormValues] = useState({
    name: formDataRef.current.name,
    shortName: formDataRef.current.shortName,
    description: formDataRef.current.description,
  });
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const relevantErr: { [key: string]: string[] } = {};
    for (const key in formValues) {
      if (key in formErrors) {
        relevantErr[key] = formErrors[key];
      }
    }
    setInputErr(relevantErr);
  }, [formErrors, formValues]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormValues((oldForm) => ({ ...oldForm, [name]: value }));
    formDataRef.current[name as FormStringValues] = value;
  };

  const errorClass = (key: string) => {
    return (inputErr[key]?.length || 0) > 0
      ? "bg-red-50 border-2 border-secondary"
      : "";
  };

  return (
    <>
      <div className="flex flex-wrap items-end gap-4 [&>label]:flex-1 [&>label]:my-1 [&>label]:first:flex-2 [&>label]:min-w-[200px]">
        <label htmlFor="name">
          <LabelFormText validationErrors={inputErr.name ?? []}>
            Nombre completo *
          </LabelFormText>
          <Input
            name="name"
            id="name"
            placeholder="Juntos por la Amazonía"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            className={errorClass("name")}
            autoComplete="off"
          />
        </label>

        <label htmlFor="shortName">
          <LabelFormText validationErrors={inputErr.shortName ?? []}>
            Nombre corto
          </LabelFormText>
          <Input
            name="shortName"
            id="shortName"
            placeholder="JPLA"
            type="text"
            value={formValues.shortName}
            onChange={handleChange}
            className={errorClass("shortName")}
            autoComplete="off"
          />
        </label>
      </div>

      <label htmlFor="description">
        <LabelFormText validationErrors={inputErr.description ?? []}>
          Descripción *
        </LabelFormText>

        <Textarea
          id="description"
          name="description"
          placeholder="Esta iniciativa busca..."
          value={formValues.description}
          onChange={handleChange}
          className={errorClass("description")}
        />
      </label>
    </>
  );
}
