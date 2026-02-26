import React, { useState } from "react";
import { Button } from "@ui/shadCN/component/button";
import { Input } from "@ui/shadCN/component/input";
import type { UserInitiatives } from "pages/monitoring/types/requestParams";
import { sendJoinInvitation } from "pages/monitoring/api/monitoringAPI";

interface InitiativeInvitationFormProps {
    initiativesAsLeader?: UserInitiatives[];
}

export function InitiativeInvitationForm({
    initiativesAsLeader = [],
}: InitiativeInvitationFormProps) {
    const [initiativeId, setInitiativeId] = useState<string>("");
    const [guestEmail, setGuestEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await sendJoinInvitation({
                initiativeId: Number(initiativeId),
                guests: [{ email: guestEmail }],
            });

            setMessage({ text: "¡Invitación enviada con éxito!", error: false });
            setGuestEmail("");
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
                        required
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

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Correo electrónico del invitado
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                        disabled={isLoading}
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
