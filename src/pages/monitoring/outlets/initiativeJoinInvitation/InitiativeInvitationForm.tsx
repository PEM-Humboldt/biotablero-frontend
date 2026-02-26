import React, { useState } from "react";
import { Button } from "@ui/shadCN/component/button";
import TextareaAutosize from "react-textarea-autosize";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import type { UserInitiatives } from "pages/monitoring/types/requestParams";
import { sendJoinInvitation, isMonitoringAPIError } from "pages/monitoring/api/monitoringAPI";
import { ErrorsList, LabelAndErrors } from "@ui/LabelingWithErrors";
import { commonErrorMessage } from "@utils/ui";
import {
  validateInvitationForm,
  type InitiativeInvitationFormErr,
} from "pages/monitoring/outlets/initiativeJoinInvitation/utils/formClientValidations";

interface InitiativeInvitationFormProps {
  initiativesAsLeader?: UserInitiatives[];
}

export function InitiativeInvitationForm({
  initiativesAsLeader = [],
}: InitiativeInvitationFormProps) {
  const [initiativeId, setInitiativeId] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [errors, setErrors] = useState<InitiativeInvitationFormErr>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    const formData = { initiativeId, guestEmail, customMessage };
    const newErrors = validateInvitationForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const emailList = guestEmail
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    try {
      const res = await sendJoinInvitation({
        initiativeId: Number(initiativeId),
        message: customMessage || undefined,
        guests: emailList.map((email) => ({ email })),
      });

      if (isMonitoringAPIError(res)) {
        const { status, message, data } = res;
        setErrors((oldErr) => ({
          ...oldErr,
          root: [
            `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
          ],
        }));
        console.error(res);
        return;
      }

      setMessage({ text: "¡Invitación enviada con éxito!", error: false });
      setGuestEmail("");
      setCustomMessage("");
      setInitiativeId("");
    } catch (error) {
      setErrors((oldErr) => ({
        ...oldErr,
        root: ["No se ha podido procesar la solicitud. Por favor intenta de nuevo."],
      }));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background w-full max-w-[600px] rounded-xl p-6 shadow-sm flex flex-col gap-4 mt-6 border border-muted">
      <h4 className="text-primary m-0! mb-2 text-lg font-semibold">
        Enviar invitación
      </h4>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <LabelAndErrors
            htmlFor="initiative"
            errID="errors_initiative"
            validationErrors={errors.initiative ?? []}
            className="mb-1 text-sm font-medium"
          >
            Selecciona la iniciativa <span aria-hidden="true">*</span>
          </LabelAndErrors>
          <select
            id="initiative"
            value={initiativeId}
            onChange={(e) => setInitiativeId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 mt-1"
            aria-invalid={errors.initiative !== undefined}
            aria-describedby={errors.initiative ? "errors_initiative" : undefined}
          >
            <option value="" disabled>
              -- Elige una iniciativa --
            </option>
            {initiativesAsLeader.map((initiative) => (
              <option key={initiative.id} value={initiative.id}>
                {initiative.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <LabelAndErrors
            htmlFor="email"
            errID="errors_email"
            validationErrors={errors.email ?? []}
            className="mb-1 text-sm font-medium"
          >
            Correos electrónicos de los invitados (separados por coma) <span aria-hidden="true">*</span>
          </LabelAndErrors>
          <InputGroup>
            <InputGroupInput
              id="email"
              type="text"
              placeholder="ejemplo1@correo.com, ejemplo2@correo.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              disabled={isLoading}
              aria-invalid={errors.email !== undefined}
              aria-describedby={errors.email ? "errors_email" : undefined}
            />
          </InputGroup>
        </div>

        <div>
          <LabelAndErrors
            htmlFor="message"
            errID="errors_message"
            validationErrors={errors.message ?? []}
            className="mb-1 text-sm font-medium"
          >
            Mensaje personalizado (opcional)
          </LabelAndErrors>
          <InputGroup>
            <TextareaAutosize
              data-slot="input-group-control"
              className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm disabled:cursor-not-allowed disabled:opacity-50"
              id="message"
              placeholder="Escribe un mensaje de hasta 200 caracteres..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              maxLength={200}
              rows={3}
              disabled={isLoading}
              aria-invalid={errors.message !== undefined}
              aria-describedby={errors.message ? "errors_message" : undefined}
            />
            <InputGroupAddon
              align="block-end"
              className={`${inputWarnColor(customMessage, 200, 0.95)} flex-row-reverse`}
            >
              {inputLengthCount(customMessage, 200)}
            </InputGroupAddon>
          </InputGroup>
        </div>

        {message && !message.error && (
          <p className="text-sm text-green-600">
            {message.text}
          </p>
        )}

        <ErrorsList
          errorItems={errors.root ?? []}
          className="bg-red-50 p-4 mt-2 rounded-lg outline-2 outline-accent"
        />

        <div className="pt-4">
          <Button type="submit" disabled={isLoading || initiativesAsLeader.length === 0} className="w-full">
            {isLoading ? "Enviando..." : "Enviar Invitación"}
          </Button>
        </div>
      </form>
    </div>
  );
}
