import { LOCALE } from "@config/monitoring";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { uiText } from "pages/monitoring/outlets/initiatives/layout/uiText";

export function BasicInfo() {
  const { initiativeInfo } = useInitiativeCTX();

  if (!initiativeInfo) {
    return null;
  }

  const creationDateObj = new Date(initiativeInfo.creationDate);

  const datetime = `${creationDateObj.getFullYear()}-${String(creationDateObj.getMonth() + 1)}`;

  const renderDate = creationDateObj.toLocaleDateString(LOCALE, {
    month: "long",
    year: "numeric",
  });

  const initiativeLocations = initiativeInfo.locations
    .map((l) => {
      const municipality = l.location.name ? `, ${l.location.name}` : "";
      const locality = l.locality ? ` - ${l.locality}` : "";
      const department = l.location?.parent ? l.location.parent.name : "";

      return `${department}${municipality}${locality}`;
    })
    .join(uiText.profile.basicInfo.locationSeparator);

  const initiativeUsers = initiativeInfo.users
    .map((u) => u.externalData.fullName)
    .join(uiText.profile.basicInfo.usersSeparator);

  return (
    <>
      <h3 className="flex flex-col text-5xl uppercase m-0">
        {initiativeInfo.shortName ?? ""}

        <div className="text-lg normal-case font-normal no-underline">
          {initiativeInfo.name}
        </div>
      </h3>

      <div className="flex flex-col mb-4 text-grey-dark">
        <div title={uiText.profile.basicInfo.usersTitle}>{initiativeUsers}</div>
        <div>
          <time
            title={uiText.profile.basicInfo.creationDateTitle}
            dateTime={datetime}
          >
            {uiText.profile.basicInfo.datePrefix}
            {renderDate}
          </time>
          {uiText.profile.basicInfo.dateLocationSeparator}
          <address title="Ubicación" className="not-italic inline">
            {initiativeLocations}
          </address>
        </div>
      </div>
    </>
  );
}
