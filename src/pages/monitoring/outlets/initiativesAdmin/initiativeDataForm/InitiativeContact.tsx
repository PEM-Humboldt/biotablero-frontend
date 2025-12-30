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
import { LabelAndErrors } from "@ui/LabelingWithErrors";
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
  const [email, setEmail] = useState(update?.email ?? "");
  const [phone, setPhone] = useState(update?.phone ?? "");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  const reset = useCallback(() => {
    setInputErr({});
    setEmail(update?.email ?? "");
    setPhone(update?.phone ?? "");
  }, [update?.email, update?.phone]);

  useEffect(() => {
    reset();
  }, [reset]);

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
      .isUniqueIn(
        new Set(
          selectedItems?.map((e) => e.phone).filter((e) => e !== undefined),
        ),
      ).result;

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
    <div className="form-input-list">
      <div>
        <LabelAndErrors
          htmlFor="email"
          errID="errors_email"
          validationErrors={inputErr.email ?? []}
        >
          <span className="sr-only">Correo</span>
        </LabelAndErrors>
        <InputGroup>
          <InputGroupAddon>
            <Mail aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            name="email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            placeholder="mi_iniciativa@dominio.com"
            maxLength={INITIATIVE_EMAIL_MAX_LENGHT}
            aria-required="true"
            aria-invalid={inputErr.email !== undefined}
            aria-describedby={inputErr.email ? "errors_email" : undefined}
          />
        </InputGroup>
      </div>

      <div>
        <LabelAndErrors
          htmlFor="phone"
          errID="errors_phone"
          validationErrors={inputErr.phone ?? []}
        >
          <span className="sr-only">Teléfono</span>
        </LabelAndErrors>
        <InputGroup>
          <InputGroupAddon>
            <Phone aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            name="phone"
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="off"
            placeholder="3046669666"
            maxLength={INITIATIVE_PHONE_MAX_LENGHT}
            aria-invalid={inputErr.phone !== undefined}
            aria-describedby={inputErr.phone ? "errors_phone" : undefined}
          />
        </InputGroup>
      </div>

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
          title="Restablecer campos"
        >
          <span className="sr-only">Restablecer campos</span>
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
    <div className="table-form-display-container">
      <table className="table-form-display">
        <caption className="sr-only">Información de contacto inscrita</caption>

        <thead>
          <tr>
            <th>Correo</th>
            <th>Teléfono</th>
            <th className="w-24">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {selectedItems.map((values, i) => (
            <tr key={`${values.email}_${i}`}>
              <td>{values.email}</td>
              <td>{values.phone ? values.phone : "---"}</td>
              <td className="table-form-actions">
                <Button
                  type="button"
                  onClick={() => editItem(i)}
                  variant="ghost-clean"
                  size="icon-sm"
                  title="Editar"
                >
                  <span className="sr-only">editar esta información</span>
                  <span aria-hidden="true">
                    <SquarePen className="size-4" />
                  </span>
                </Button>

                <Button
                  type="button"
                  onClick={() => deleteItem(i)}
                  variant="ghost-clean"
                  size="icon-sm"
                  title="Borrar"
                >
                  <span className="sr-only">borrar esta información</span>
                  <span aria-hidden="true">
                    <Eraser className="size-4" />
                  </span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
