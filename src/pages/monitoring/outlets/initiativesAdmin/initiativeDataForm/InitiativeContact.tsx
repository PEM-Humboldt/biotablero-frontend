import { useCallback, useEffect, useState } from "react";
import { Input } from "@ui/shadCN/component/input";
import { Button } from "@ui/shadCN/component/button";
import type {
  InitiativeContact,
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { Check, CirclePlus, Eraser, SquarePen, UndoDot } from "lucide-react";

export function ContactInfoInput({
  setter,
  update,
}: ItemEditorProps<InitiativeContact>) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const reset = useCallback(() => {
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
    const newContact = { phone, email };
    setter((savedData) => [...savedData, newContact]);
    reset();
  };

  return (
    <div className="flex gap-2 [&>label]:flex-1 items-end mb-4">
      <label htmlFor="email">
        <span>Correo</span>
        <Input
          type="email"
          placeholder="mi_iniciativa@dominio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
      </label>

      <label htmlFor="phone">
        <span>Teléfono</span>
        <Input
          type="tel"
          placeholder="3046669666"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="off"
        />
      </label>

      <Button onClick={reset} type="button" variant="outline" size="icon">
        <span className="sr-only">Reiniciar</span>
        <span aria-hidden="true">
          <UndoDot className="size-5" />
        </span>
      </Button>

      {update !== null ? (
        <Button
          onClick={handleSave}
          type="button"
          variant="outline"
          size="icon"
        >
          <span className="sr-only">Guardar cambios</span>
          <span aria-hidden="true">
            <Check className="size-5" />
          </span>
        </Button>
      ) : (
        <Button
          onClick={handleSave}
          type="button"
          variant="outline"
          size="icon"
        >
          <span className="sr-only">Añadir un nuevo método de contacto</span>
          <span aria-hidden="true">
            <CirclePlus className="size-5" />
          </span>
        </Button>
      )}
    </div>
  );
}

export function ContactInfoDisplay({
  items,
  editItem,
  deleteItem,
}: ItemsRenderProps<InitiativeContact>) {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-500">
        No hay información de contacto registrada.
      </p>
    );
  }

  return (
    <table className="divide-y [&_th]:px-2 [&_td]:px-2">
      <thead className="bg-gray-50">
        <tr className="text-left [&_th]:font-normal">
          <th>Correo</th>
          <th>Teléfono</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {items.map((values, i) => (
          <tr key={`${values.email}_${i}`} className="hover:bg-muted">
            <td className="whitespace-nowrap">{values.email}</td>
            <td className="whitespace-nowrap">{values.phone}</td>
            <td className="whitespace-nowrap">
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
