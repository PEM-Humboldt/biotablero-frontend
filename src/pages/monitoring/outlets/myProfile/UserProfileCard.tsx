import { useUserCTX } from "@hooks/UserCTX";
import { useNavigate } from "react-router";
import { Button } from "@ui/shadCN/component/button";
import { CircleUserRound, NotebookPen } from "lucide-react";
import { uiText } from "pages/monitoring/outlets/myProfile/layout/uiText";

export function UserProfileCard() {
  const { user, updateUser } = useUserCTX();
  const navigate = useNavigate();

  if (!user) {
    void navigate("/Monitoreo");
    return;
  }

  return !user ? null : (
    <div className="rounded-lg bg-background p-4 lg:p-8 flex gap-4 lg:gap-8 items-start">
      {user.picture ? (
        <img
          src={user.picture}
          className="rounded-full flex-1 object-cover aspect-square w-full max-w-[180px]"
          alt=""
        />
      ) : (
        <CircleUserRound className="size-40 text-primary/50" strokeWidth={2} />
      )}
      <ul aria-label="Datos registrados" className="flex-2">
        <li
          className="text-3xl font-normal mb-4"
          aria-label={uiText.profileCard.fullNameSrTitle}
        >
          {user.firstName} {user.lastName}
        </li>
        <li aria-label={uiText.profileCard.emailSrTitle} className="mb-4">
          <a href={`mailto:${user.email}`} className="text-primary font-normal">
            {user.email}
          </a>
        </li>
        <li>
          <span className="font-normal">{uiText.profileCard.genderTitle} </span>
          {user.gender}
        </li>
        <li>
          <span className="font-normal">{uiText.profileCard.ethnic} </span>
          {user.selfIdentification}
        </li>
        <li>
          <span className="font-normal">
            {uiText.profileCard.organization}{" "}
          </span>
          {user.organization}
        </li>
        <li className="flex justify-end mt-6">
          <Button
            onClick={() => void updateUser()}
            title={uiText.profileCard.editButton.title}
            aria-label={uiText.profileCard.editButton.sr}
          >
            <NotebookPen aria-hidden="true" />
            <span aria-hidden="true">
              {uiText.profileCard.editButton.label}
            </span>
          </Button>
        </li>
      </ul>
    </div>
  );
}
