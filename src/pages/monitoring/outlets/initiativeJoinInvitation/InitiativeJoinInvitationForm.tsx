import React, { useState } from "react";
import { Button } from "@ui/shadCN/component/button";
import { Input } from "@ui/shadCN/component/input";
import type { UserInitiatives } from "pages/monitoring/types/requestParams";
import { sendJoinInvitation } from "pages/monitoring/api/monitoringAPI";
import { ErrorsList } from "@ui/LabelingWithErrors";
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
            await sendJoinInvitation({
                initiativeId: Number(initiativeId),
                message: customMessage || undefined,
                guests: emailList.map((email) => ({ email })),
            });

            setMessage({ text: "¡Invitación enviada con éxito!", error: false });
            setGuestEmail("");
            setCustomMessage("");
            setInitiativeId("");
        } catch (error) {
            setMessage({
                text: "Hubo un error al enviar la invitación. Inténtalo de nuevo.",
                error: true,
            });
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
                <div className="flex flex-col gap-2">
                    <label htmlFor="initiative" className="text-sm font-medium">
                        Selecciona la iniciativa
                    </label>
                    <select
                        id="initiative"
                        value={initiativeId}
                        onChange={(e) => setInitiativeId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
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
                    {errors.initiative && (
                        <ErrorsList errorItems={errors.initiative} className="mt-1 flex flex-col gap-1" />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Correos electrónicos de los invitados (separados por coma)
                    </label>
                    <Input
                        id="email"
                        type="text"
                        placeholder="ejemplo1@correo.com, ejemplo2@correo.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <ErrorsList errorItems={errors.email} className="mt-1 flex flex-col gap-1" />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium">
                        Mensaje personalizado (opcional)
                    </label>
                    <textarea
                        id="message"
                        placeholder="Escribe un mensaje de hasta 200 caracteres..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        maxLength={200}
                        rows={3}
                        disabled={isLoading}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {message && (
                    <p
                        className={`text-sm ${message.error ? "text-accent" : "text-green-600"}`}
                    >
                        {message.text}
                    </p>
                )}

                <div className="pt-4">
                    <Button type="submit" disabled={isLoading || initiativesAsLeader.length === 0} className="w-full">
                        {isLoading ? "Enviando..." : "Enviar Invitación"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
