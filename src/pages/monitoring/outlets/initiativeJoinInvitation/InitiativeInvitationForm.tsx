import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { Button } from "@ui/shadCN/component/button";
import TextareaAutosize from "react-textarea-autosize";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import type { UserInitiatives } from "pages/monitoring/types/requestParams";
import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { ErrorsList, LabelAndErrors } from "@ui/LabelingWithErrors";
import { commonErrorMessage } from "@utils/ui";
import { invitationValidations } from "pages/monitoring/outlets/initiativeJoinInvitation/utils/formClientValidations";
import { StrValidator } from "@utils/strValidator";
import { INITIATIVE_INVITATION_MESSAGE_MAX_LENGTH } from "@config/monitoring";
import { makeInitialInfo } from "pages/monitoring/outlets/initiativeJoinInvitation/utils/formObjectUpdate";
import type {
  JoinInitiativeDataForm,
  JoinInitiativeGuest,
  JoinInitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativeJoinInvitation/types/initiativeInvitationData";
import { validateFormClient } from "pages/monitoring/outlets/initiativesAdmin/utils/validateFormClient";
import { uiText } from "pages/monitoring/outlets/initiativeJoinInvitation/layout/uiText";

interface InitiativeInvitationFormProps {
  initiativesAsLeader?: UserInitiatives[];
}

export function InitiativeInvitationForm({
  initiativesAsLeader = [],
}: InitiativeInvitationFormProps) {
  const [errors, setErrors] = useState<Partial<JoinInitiativeDataFormErr>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [guestEmails, setGuestEmails] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [formData, setFormData] =
    useState<JoinInitiativeDataForm>(makeInitialInfo());
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);

  const validateField = useCallback(
    (
      fieldName: keyof JoinInitiativeDataForm,
      validation: StrValidator,
      onClean?: (cleanValue: string) => void,
    ) => {
      const [cleanValue, fieldErrors] = validation.result;

      if (fieldErrors.length > 0) {
        setErrors((oldErr) => ({ ...oldErr, [fieldName]: fieldErrors }));
        return;
      }

      setErrors(({ [fieldName]: _, ...oldErr }) => oldErr);
      if (onClean) {
        onClean(cleanValue);
      }
    },
    [],
  );

  const handleFormReset = () => {
    setFormData(makeInitialInfo());
    setGuestEmails("");
    setCustomMessage("");
    setErrors({});
    setMessage(null);
  };

  const messageOnBlur = () =>
    validateField(
      "message",
      new StrValidator(customMessage)
        .isOptional()
        .sanitize()
        .hasLengthLessOrEqualThan(INITIATIVE_INVITATION_MESSAGE_MAX_LENGTH),
      (val) => {
        setCustomMessage(val);
        setFormData((old) => ({ ...old, message: val }));
      },
    );

  const initiativeOnBlur = () => {
    const initId = formData.initiativeId;
    if (!initId || initId <= 0) {
      setErrors((old) => ({
        ...old,
        initiativeId: [uiText.form.validation.initiativeIdRequired],
      }));
    } else {
      setErrors(({ initiativeId: _, ...old }) => old);
    }
  };

  const emailsOnBlur = () => {
    validateField("guests", new StrValidator(guestEmails).sanitize(), (val) => {
      setGuestEmails(val);
      const emailList = val
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "");

      setFormData((old) => ({
        ...old,
        guests: emailList.map((email) => ({ email }) as JoinInitiativeGuest),
      }));
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    emailsOnBlur();
    messageOnBlur();
    initiativeOnBlur();

    const currentErrors = validateFormClient(formData, invitationValidations);
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const payload: JoinInitiativeDataForm = {
        initiativeId: formData.initiativeId,
        message: formData.message,
        guests: formData.guests,
      };

      const res = await monitoringAPI<JoinInitiativeDataForm>({
        type: "post",
        endpoint: "JoinInvitation",
        options: {
          data: payload,
        },
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

      handleFormReset();
      setMessage({ text: uiText.success, error: false });
    } catch (err) {
      setErrors((oldErr) => ({ ...oldErr, root: [uiText.error.noUpdateData] }));
      console.error(uiText.criticalError.log, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background w-full max-w-[600px] rounded-xl p-6 shadow-sm flex flex-col gap-4 mt-6 border border-muted">
      <h4 className="text-primary m-0! mb-2 text-lg font-semibold">
        {uiText.title}
      </h4>

      <form
        action=""
        onReset={handleFormReset}
        onSubmit={(e) => void handleSubmit(e)}
        className="flex flex-col gap-4"
      >
        <div>
          <LabelAndErrors
            htmlFor="initiative"
            errID="errors_initiative"
            validationErrors={errors.initiativeId ?? []}
            className="mb-1 text-sm font-medium"
          >
            {uiText.form.selectInitiativeLabel}{" "}
            <span aria-hidden="true">*</span>
          </LabelAndErrors>
          <select
            id="initiative"
            value={formData.initiativeId || ""}
            onChange={(e) =>
              setFormData((old) => ({
                ...old,
                initiativeId: Number(e.target.value),
              }))
            }
            onBlur={initiativeOnBlur}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 mt-1"
            aria-invalid={errors.initiativeId !== undefined}
            aria-describedby={
              errors.initiativeId ? "errors_initiative" : undefined
            }
          >
            <option value="" disabled>
              {uiText.form.defaultInitiativeTitle}
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
            errID="errors_guests"
            validationErrors={errors.guests ?? []}
            className="mb-1 text-sm font-medium"
          >
            {uiText.form.emailsLabel}
            <span aria-hidden="true">*</span>
          </LabelAndErrors>
          <InputGroup>
            <InputGroupInput
              id="email"
              type="text"
              placeholder="ejemplo1@correo.com, ejemplo2@correo.com"
              value={guestEmails}
              onChange={(e) => setGuestEmails(e.target.value)}
              onBlur={emailsOnBlur}
              disabled={isLoading}
              aria-invalid={errors.guests !== undefined}
              aria-describedby={errors.guests ? "errors_guests" : undefined}
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
            {uiText.form.messageLabel}
          </LabelAndErrors>
          <InputGroup>
            <TextareaAutosize
              data-slot="input-group-control"
              className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm disabled:cursor-not-allowed disabled:opacity-50"
              id="message"
              placeholder="Escribe un mensaje..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              onBlur={messageOnBlur}
              rows={3}
              disabled={isLoading}
              aria-describedby={errors.message ? "errors_message" : undefined}
              maxLength={INITIATIVE_INVITATION_MESSAGE_MAX_LENGTH}
            />
            <InputGroupAddon
              align="block-end"
              className={`${inputWarnColor(customMessage, INITIATIVE_INVITATION_MESSAGE_MAX_LENGTH, 0.95)} flex-row-reverse`}
            >
              {inputLengthCount(
                customMessage,
                INITIATIVE_INVITATION_MESSAGE_MAX_LENGTH,
              )}
            </InputGroupAddon>
          </InputGroup>
        </div>

        {message && !message.error && (
          <p className="text-sm text-green-600">{message.text}</p>
        )}

        <ErrorsList
          errorItems={errors.root ?? []}
          className="bg-red-50 p-4 mt-2 rounded-lg outline-2 outline-accent"
        />

        <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-2">
          <Button
            type="submit"
            disabled={isLoading || initiativesAsLeader.length === 0}
          >
            {isLoading ? uiText.loading : uiText.save}
          </Button>
          <Button
            type="reset"
            variant="outline_destructive"
            disabled={isLoading}
          >
            {uiText.restartForm}
          </Button>
        </div>
      </form>
    </div>
  );
}
