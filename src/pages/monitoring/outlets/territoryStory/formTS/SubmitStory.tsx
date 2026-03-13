import { Switch } from "@ui/shadCN/component/switch";
import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";
export function SubmitStory({
  enabled,
  setEnabled,
  restricted,
  setRestricted,
  submitErrors,
}: {
  enabled: boolean;
  setEnabled: (set: boolean) => void;
  restricted: boolean;
  setRestricted: (set: boolean) => void;
  submitErrors: string[];
}) {
  return (
    <>
      <div className="w-full md:w-[50%] lg:w-[30%] ml-auto bg-background flex flex-col rounded-lg border border-input p-2">
        <span className="text-primary font-normal">
          Configuración del relato
        </span>
        <div className="flex gap-2 items-center">
          <Switch
            id="enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label="Estado de publicación"
          />
          <label
            htmlFor="enabled"
            className="cursor-pointer"
            title={
              enabled
                ? "El relato estará disponible al guardarlo"
                : "El relato se mantendrá en borrador al guardarlo"
            }
          >
            <span className="sr-only">
              {enabled ? "Modo público activo" : "Modo borrador activo"}
            </span>
            {enabled ? "Publicar" : "Borrador"}
          </label>
        </div>

        <div className="flex gap-2 items-center">
          <Switch
            id="restricted"
            checked={restricted}
            onCheckedChange={setRestricted}
            aria-label="Restricción de público"
          />
          <label
            htmlFor="restricted"
            className="cursor-pointer"
            title={
              restricted
                ? "El relato sólo puede ser visto por quienes hacen parte de la iniciativa"
                : "El relato es público"
            }
          >
            <span className="sr-only">
              {restricted ? "Modo privado activo" : "Modo público activo"}
            </span>
            {restricted
              ? "Sólo para personas en la iniciativa"
              : "Cualquier persona puede leerlo"}
          </label>
        </div>
      </div>

      <ErrorsList
        className="w-full md:w-[50%] lg:w-[30%] ml-auto bg-accent/10 border border-accent p-4 rounded-lg"
        errorItems={submitErrors}
      />

      <div className="flex justify-between">
        <Button type="reset" variant="outline_destructive">
          Reiniciar
        </Button>
        <Button type="submit">{enabled ? "Publicar" : "Guardar"}</Button>
      </div>
    </>
  );
}
