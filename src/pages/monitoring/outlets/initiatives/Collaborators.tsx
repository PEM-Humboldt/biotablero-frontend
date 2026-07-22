import { LOCALE } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";
import { parseSimpleMarkdown } from "@utils/textParser";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { uiText } from "pages/monitoring/outlets/initiatives/layout/uiText";

const roleDictionaryTranslation: Partial<Record<RoleInInitiative, string>> = {
  [RoleInInitiative.LEADER]: "Líder",
  [RoleInInitiative.COLLABORATOR]: "Colaborador",
  [RoleInInitiative.READER]: "Observador",
};

export function Collaborators() {
  const { initiativeInfo } = useInitiativeCTX();

  const collaborators = initiativeInfo?.users
    ? [...initiativeInfo.users].sort((a, b) => {
        if (a.level.id !== b.level.id) {
          return a.level.id - b.level.id;
        }
        return (
          new Date(a.creationDate).getTime() -
          new Date(b.creationDate).getTime()
        );
      })
    : [];

  return (
    <main className="bg-[#f5f5f5] w-full p-4 *:max-w-7xl flex flex-col gap-4 items-center h-full">
      <header className="p-6 pb-0 w-full">
        <h3 className="text-primary">{uiText.collaborators.title}</h3>
        <div className="[&_p]:max-w-[65ch] [&_p]:text-lg">
          {parseSimpleMarkdown(uiText.collaborators.descriptionMd)}
        </div>
      </header>

      {collaborators.length === 0 ? (
        <div className="text-xl text-primary">
          {uiText.collaborators.noCollaborators}
        </div>
      ) : (
        <ul
          className={cn(
            "w-full bg-background rounded-xl m-2 p-2 md:p-6",
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6 ",
          )}
          aria-label="Colaboradores de la iniciativa"
        >
          {collaborators.map((collaborator) => {
            const joinDate = new Date(
              collaborator.creationDate,
            ).toLocaleDateString(LOCALE, {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <li
                key={`collaboratorCard_${collaborator.userName}`}
                className="p-2 lg:p-6 rounded-lg shadow space-y-4 outline outline-transparent hover:outline-primary transition-colors duration-300"
              >
                <div className="flex gap-2 items-center">
                  {collaborator.externalData.picture && (
                    <img
                      src={collaborator.externalData.picture}
                      alt=""
                      className="rounded-full aspect-square w-14 outline outline-primary"
                    />
                  )}
                  <div>
                    <h4 className="m-0">
                      {collaborator.externalData.fullName ??
                        collaborator.userName}
                    </h4>
                    <div className="italic text-grey-dark/80 text-sm font-normal">
                      {uiText.collaborators.joininInfo(
                        joinDate,
                        roleDictionaryTranslation[collaborator.level.id] ?? "",
                      )}
                    </div>
                  </div>
                </div>
                {collaborator.focusArea && (
                  <p className="m-0 text-pretty">{collaborator.focusArea}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
