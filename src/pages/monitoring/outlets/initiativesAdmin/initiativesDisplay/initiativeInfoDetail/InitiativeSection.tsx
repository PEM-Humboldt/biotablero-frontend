import type { ElementType } from "react";
import type { InitiativeDataFormFormatted } from "../../types/initiativeData";

// type JustOne<T> = { [K in keyof T]: { [P in K]: T[P] } }[keyof T];

export function InitiativeSection<K extends keyof InitiativeDataFormFormatted>({
  edit,
  title,
  info,
  group,
  DisplayInfo,
}: {
  edit: boolean;
  title: string;
  group: K;
  info: InitiativeDataFormFormatted;
  DisplayInfo: ElementType<{ info: InitiativeDataFormFormatted[K] }>;
  // EditInfo: ElementType<{title: string, sectionInfo: InitiativeDataFormFormatted[K], sectionUpdater:  (key: K) => void, validationErrors:string[]}>
}) {
  return (
    <>
      <h4>{title}</h4>
      {edit ? <div>trabajando...</div> : <DisplayInfo info={info[group]} />}
    </>
  );
}

export function DisplayGeneral({
  info,
}: {
  info: InitiativeDataFormFormatted["general"];
}) {
  return (
    <div>
      <div className="h3">{info.name}</div>
      {info.shortName && <div>Nombre corto: {info.shortName}</div>}
      <div>Descripción: {info.description}</div>
      {info.objective && <div>Objetivo: {info.objective}</div>}
      {info.influenceArea && (
        <div>Zóna de influencia: {info.influenceArea}</div>
      )}
    </div>
  );
}

export function DisplayLocations({
  info,
}: {
  info: InitiativeDataFormFormatted["locations"];
}) {
  return info.map((l) => {
    const municipality = l.municipality !== null ? `, ${l.municipality}` : "";
    const locality = l.locality !== null ? ` - ${l.locality}` : "";

    return (
      <>
        {`${l.department}${municipality}${locality}`}
        <br />
      </>
    );
  });
}

export function DisplayUsers({
  info,
}: {
  info: InitiativeDataFormFormatted["users"];
}) {
  return info.map((u) => {
    return (
      <>
        {`${u.userName} - ${u.level.name}`}
        <br />
      </>
    );
  });
}

export function DisplayContacts({
  info,
}: {
  info: InitiativeDataFormFormatted["contacts"];
}) {
  return info.map((c) => {
    return (
      <>
        {c.email} {c.phone && ` - ${c.phone}`}
        <br />
      </>
    );
  });
}

export function DisplayImages({
  info,
}: {
  info: InitiativeDataFormFormatted["images"];
}) {
  return (
    <>
      {info.imageUrl && (
        <div>
          <span>Imagen de la iniciativa</span>
          <img src={info.imageUrl as string} alt="" />
        </div>
      )}
      {info.bannerUrl && (
        <div>
          <span>Banner de la iniciativa</span>
          <img src={info.bannerUrl as string} alt="" />
        </div>
      )}
    </>
  );
}
