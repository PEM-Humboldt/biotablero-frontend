import { ComponentType, ReactElement, useState } from "react";
import type { InitiativeDataFormFormatted } from "../../types/initiativeData";
import { EditModeButton } from "./EditModeTrigger";

export function InitiativeSection<K extends keyof InitiativeDataFormFormatted>({
  active,
  title,
  info,
  DisplayElement,
}: {
  active: boolean;
  title: string;
  info: InitiativeDataFormFormatted[K];
  DisplayElement: ComponentType<{ info: InitiativeDataFormFormatted[K] }>;
}) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <h4>{title}</h4>
      {active && (
        <EditModeButton state={edit} setState={() => setEdit((e) => !e)} />
      )}

      {edit ? "carajo..." : <DisplayElement info={info} />}
    </>
  );
}

export function DisplayInitiativeGeneralInfo({
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

function DisplayGeneral({
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

function DisplayLocations({
  info,
}: {
  info: InitiativeDataFormFormatted["locations"];
}) {
  return info.map((l) => {
    const municipality = l.municipality !== null ? `, ${l.municipality}` : "";
    const locality = l.locality !== null ? ` - ${l.locality}` : "";

    return (
      <div key={`${l.departmentId}_${l.municipalityId}_${l.locality}`}>
        {`${l.department}${municipality}${locality}`}
        <br />
      </div>
    );
  });
}

function DisplayUsers({
  info,
}: {
  info: InitiativeDataFormFormatted["users"];
}) {
  return info.map((u) => {
    return (
      <div key={u.userName}>
        {`${u.userName} - ${u.level.name}`}
        <br />
      </div>
    );
  });
}

function DisplayContacts({
  info,
}: {
  info: InitiativeDataFormFormatted["contacts"];
}) {
  return info.map((c) => {
    return (
      <div key={c.email}>
        {c.email} {c.phone && ` - ${c.phone}`}
        <br />
      </div>
    );
  });
}

function DisplayImages({
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
