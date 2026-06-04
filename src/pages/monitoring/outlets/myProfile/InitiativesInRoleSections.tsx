import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { Link } from "react-router";
import { LinkIcon, NotebookPen } from "lucide-react";

import { useUserCTX } from "@hooks/UserContext";
import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";

import type { InitiativeCompleteInfo } from "pages/monitoring/types/initiative";
import { type RoleInInitiative } from "pages/monitoring/types/catalog";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { LeaveInitiativeBtn } from "pages/monitoring/outlets/myProfile/initiativesInRoleSections/LeaveInitiativeBtn";
import { InitiativeFocusAreaForm } from "pages/monitoring/outlets/myProfile/initiativesInRoleSections/InitiativeFocusAreaForm";
import { getRandomImageURL } from "pages/monitoring/outlets/initiatives/territoryStories/utils/getFeaturedImage";
import { sectionsInfo } from "pages/monitoring/outlets/myProfile/layout/sectionsInfo";
import { uiText } from "pages/monitoring/outlets/myProfile/layout/uiText";

export function InitiativesInRoleSections() {
  const { userInitiativesAs } = useUserInMonitoringCTX();
  const [currentFocusAreaEdit, setCurrentFocusAreaEdit] = useState<
    number | null
  >(null);

  const roles = Object.keys(sectionsInfo);

  return roles.map((key) => {
    const role = Number(key) as RoleInInitiative;
    const sectionInfo = sectionsInfo[role];
    const initiatives = userInitiativesAs[role];

    return !sectionInfo || !initiatives || initiatives.length === 0 ? null : (
      <section
        key={`initiatives_as_${role}`}
        aria-labelledby={`heading_${role}`}
      >
        <h3
          id={`heading_${role}`}
          className="text-primary px-4 text-xl"
          aria-label={sectionInfo.texts.title.sr}
        >
          {sectionInfo.texts.title.label}
        </h3>
        <ul
          className={cn(
            "grid gap-4",
            sectionInfo.actions.editRole
              ? "grid-cols-[repeat(auto-fill,minmax(500px,1fr))]"
              : "grid-cols-[repeat(auto-fill,minmax(400px,1fr))]",
          )}
        >
          {initiatives.map((initiative) => (
            <InitiativeFocusArea
              key={`focusAreaIn_${initiative.id}`}
              initiative={initiative}
              showPicture={sectionInfo.showInitiativePicture}
              currentFocusAreaEdit={currentFocusAreaEdit}
              setCurrentFocusAreaEdit={setCurrentFocusAreaEdit}
              editRoleAction={sectionInfo.actions.editRole}
              leaveInitiativeAction={sectionInfo.actions.leaveInitiative}
            />
          ))}
        </ul>
      </section>
    );
  });
}

function InitiativeFocusArea({
  initiative,
  showPicture,
  currentFocusAreaEdit,
  setCurrentFocusAreaEdit,
  editRoleAction,
  leaveInitiativeAction,
}: {
  initiative: InitiativeCompleteInfo;
  showPicture: boolean;
  currentFocusAreaEdit: number | null;
  setCurrentFocusAreaEdit: Dispatch<SetStateAction<number | null>>;
  editRoleAction: boolean;
  leaveInitiativeAction: boolean;
}) {
  const { user } = useUserCTX();

  const handleFocusAreaEdit = () => {
    setCurrentFocusAreaEdit(initiative.id);
  };

  const userFocusAreaInInitiative = useMemo(
    () => initiative.users.find((u) => u.userName === user?.username),
    [initiative.users, user?.username],
  );

  const cardText = editRoleAction
    ? (userFocusAreaInInitiative?.focusArea ??
      uiText.roleInSections.undefinedRoleInInitiative)
    : initiative.description;

  return (
    <li
      className={cn(
        "w-full flex rounded-lg overflow-hidden outline-2 -outline-offset-2 outline-transparent hover:outline-primary transition-[background-color,outline-color] duration-300 ease-in-out",
        initiative.id !== currentFocusAreaEdit
          ? "bg-background"
          : "bg-input/50 outline-2 outline-primary -outline-offset-2",
      )}
      aria-label={`initiativeName_${initiative.name}`}
    >
      {showPicture && (
        <img
          src={initiative.imageUrl ?? getRandomImageURL()}
          alt=""
          className="object-cover flex-1 min-w-0"
        />
      )}

      <div className="flex-2 p-4 flex flex-col justify-between gap-4">
        {initiative.id !== currentFocusAreaEdit ? (
          <>
            <div>
              <h4 id={`initiativeName_${initiative.name}`}>
                {initiative.name}
                <Button variant="ghost-clean" asChild>
                  <Link
                    to={`/Monitoreo/Iniciativas/${initiative.id}`}
                    title={uiText.roleInSections.gotoInitiativeBtn.title}
                    aria-label={uiText.roleInSections.gotoInitiativeBtn.sr}
                  >
                    <LinkIcon aria-hidden="true" />
                    <span aria-hidden="true">
                      {uiText.roleInSections.gotoInitiativeBtn.label}
                    </span>
                  </Link>
                </Button>
              </h4>
              <p
                title={
                  editRoleAction
                    ? uiText.roleInSections.cardDescriptionTitle.role
                    : uiText.roleInSections.cardDescriptionTitle.initiative
                }
              >
                {cardText}
              </p>
            </div>
            <div className="flex flex-row-reverse gap-2 justify-between">
              {editRoleAction && (
                <Button
                  onClick={() => handleFocusAreaEdit()}
                  title={
                    userFocusAreaInInitiative?.focusArea
                      ? uiText.roleInSections.updateRoleButton.title
                      : uiText.roleInSections.addRoleButton.title
                  }
                  aria-label={
                    userFocusAreaInInitiative?.focusArea
                      ? uiText.roleInSections.updateRoleButton.sr
                      : uiText.roleInSections.addRoleButton.sr
                  }
                >
                  <NotebookPen aria-hidden="true" />
                  <span aria-hidden="true">
                    {userFocusAreaInInitiative?.focusArea
                      ? uiText.roleInSections.updateRoleButton.label
                      : uiText.roleInSections.addRoleButton.label}
                  </span>
                </Button>
              )}
              {leaveInitiativeAction && (
                <LeaveInitiativeBtn initiative={initiative} />
              )}
            </div>
          </>
        ) : (
          <InitiativeFocusAreaForm
            initiative={initiative}
            initialFocusArea={userFocusAreaInInitiative?.focusArea ?? ""}
            onCancel={() => setCurrentFocusAreaEdit(null)}
            onSaveSuccess={() => setCurrentFocusAreaEdit(null)}
          />
        )}
      </div>
    </li>
  );
}
