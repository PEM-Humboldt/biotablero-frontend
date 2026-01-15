import { useCallback, useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { StrValidator } from "@utils/strValidator";
import {
  INITIATIVE_EMAIL_MAX_LENGHT,
  INITIATIVE_PHONE_MAX_LENGHT,
} from "@config/monitoring";

import type {
  InitiativeContact,
  ItemEditorProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { InputListActionButtons } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/InputListActionButtons";

export function ContactInput<T extends InitiativeContact>({
  selectedItems,
  setter,
  update,
  discard,
}: ItemEditorProps<T>) {
  const [email, setEmail] = useState(update?.email ?? "");
  const [phone, setPhone] = useState(update?.phone ?? "");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  const reset = useCallback(() => {
    setEmail(update?.email ?? "");
    setPhone(update?.phone ?? "");

    setInputErr({});
  }, [update?.email, update?.phone]);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleSave = () => {
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

    const newContact: InitiativeContact = { email: cleanEmail };
    if (cleanPhone !== "") {
      newContact.phone = cleanPhone;
    }

    setter(newContact as T);
    setEmail("");
    setPhone("");

    setInputErr({});
  };

  const handleDiscard = () => {
    if (update && discard) {
      discard();
    } else {
      setEmail("");
      setPhone("");
    }

    setInputErr({});
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

      <InputListActionButtons
        update={update}
        handleSave={handleSave}
        handleDiscard={handleDiscard}
        reset={() => void reset()}
      />
    </div>
  );
}
