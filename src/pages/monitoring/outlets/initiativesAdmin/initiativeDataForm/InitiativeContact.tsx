import { useCallback, useEffect, useState } from "react";
import {
  Check,
  CirclePlus,
  Eraser,
  Mail,
  Phone,
  SquarePen,
  UndoDot,
} from "lucide-react";

import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { TextAndErrorForLabel } from "@ui/TextAndErrorForLabel";
import { StrValidator } from "@utils/validator";

import type {
  InitiativeContact,
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

const INITIATIVE_EMAIL_MAX_LENGHT = 120;
const INITIATIVE_PHONE_MAX_LENGHT = 10;

export function ContactInfoInput({
  selectedItems,
  setter,
  update,
}: ItemEditorProps<InitiativeContact>) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  const reset = useCallback(() => {
    setInputErr({});
    setEmail(update?.email ?? "");
    setPhone(update?.phone ?? "");
  }, [update]);

  useEffect(() => {
    if (!update) {
      return;
    }

    reset();
  }, [update, reset]);

  const handleSave = () => {
    setInputErr({});

    const [cleanEmail, emailErrors] = new StrValidator(email)
      .sanitize()
      .isRequired()
      .hasLengthLessOrEqualThan(INITIATIVE_EMAIL_MAX_LENGHT)
      .isEmail()
      .isUniqueIn(new Set(selectedItems?.map((e) => e.email))).result;

    const [cleanPhone, phoneErrors] = new StrValidator(phone)
      .isOptional()
      .sanitize()
      .isColombianPhone()
      .isUniqueIn(new Set(selectedItems?.map((e) => e.phone))).result;

    const errors = {
      ...(emailErrors.length > 0 && { email: emailErrors }),
      ...(phoneErrors.length > 0 && { phone: phoneErrors }),
    };

    if (Object.keys(errors).length > 0) {
      setInputErr(errors);
      return;
    }

    const newContact = { phone: cleanPhone, email: cleanEmail };

    setter((savedData) => [...savedData, newContact]);
    setInputErr({});
    setEmail("");
    setPhone("");
  };

  return (
    <div className="flex gap-2 [&>label]:flex-1 items-end mb-4">
      <label htmlFor="email">
        <TextAndErrorForLabel validationErrors={inputErr["email"] ?? {}}>
          <span className="sr-only">Correo</span>
        </TextAndErrorForLabel>
        <InputGroup>
          <InputGroupAddon>
            <Mail aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="email"
            placeholder="mi_iniciativa@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            maxLength={INITIATIVE_EMAIL_MAX_LENGHT}
            aria-invalid={inputErr.email !== undefined}
          />
        </InputGroup>
      </label>

      <label htmlFor="phone">
        <TextAndErrorForLabel validationErrors={inputErr["phone"] ?? {}}>
          <span className="sr-only">Teléfono</span>
        </TextAndErrorForLabel>
        <InputGroup>
          <InputGroupAddon>
            <Phone aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="tel"
            placeholder="3046669666"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="off"
            maxLength={INITIATIVE_PHONE_MAX_LENGHT}
            aria-invalid={inputErr.phone !== undefined}
          />
        </InputGroup>
      </label>

      <ButtonGroup>
        <Button
          onClick={handleSave}
          type="button"
          variant="outline"
          size="icon"
          title={update !== null ? "Guardar cambios" : "Añadir contacto"}
        >
          <span className="sr-only">
            {update !== null ? "Guardar cambios" : "Añadir contacto"}
          </span>
          <span aria-hidden="true">
            {update !== null ? (
              <Check className="size-5" />
            ) : (
              <CirclePlus className="size-5" />
            )}
          </span>
        </Button>

        <Button
          onClick={reset}
          type="button"
          variant="outline"
          size="icon"
          title="Reiniciar"
        >
          <span className="sr-only">Reiniciar</span>
          <span aria-hidden="true">
            <UndoDot className="size-5" />
          </span>
        </Button>
      </ButtonGroup>
    </div>
  );
}

export function ContactInfoDisplay({
  selectedItems,
  editItem,
  deleteItem,
}: ItemsRenderProps<InitiativeContact>) {
  if (!selectedItems || selectedItems.length === 0) {
    return (
      <p className="text-gray-500">
        No hay información de contacto registrada.
      </p>
    );
  }

  return (
    <table className="w-full [&_th]:px-2 [&_td]:px-2">
      <caption className="text-left border-b h4">
        Información de contacto inscrita
      </caption>

      <thead className="sr-only">
        <tr className="text-left [&_th]:font-normal">
          <th>Correo</th>
          <th>Teléfono</th>
          <th className="w-px"></th>
        </tr>
      </thead>

      <tbody>
        {selectedItems.map((values, i) => (
          <tr key={`${values.email}_${i}`} className="hover:bg-muted">
            <td className="whitespace-nowrap">{values.email}</td>
            <td className="whitespace-nowrap">
              {values.phone ? values.phone : "---"}
            </td>
            <td className="whitespace-nowrap w-px">
              <Button
                type="button"
                onClick={() => editItem(i)}
                variant="ghost-clean"
                className="mr-2"
                size="icon-sm"
              >
                <span className="sr-only">editar la siguiente información</span>
                <span aria-hidden="true">
                  <SquarePen className="size-4" />
                </span>
              </Button>

              <Button
                type="button"
                onClick={() => deleteItem(i)}
                variant="ghost-clean"
                size="icon-sm"
              >
                <span className="sr-only">borrar la siguiente información</span>
                <span aria-hidden="true">
                  <Eraser className="size-4" />
                </span>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
