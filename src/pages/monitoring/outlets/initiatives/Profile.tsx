import { LOCALE } from "@config/monitoring";

import { Stats } from "pages/monitoring/outlets/initiatives/profile/Stats";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";

export function Profile() {
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
      const municipality =
        l.location.name !== null ? `, ${l.location.name}` : "";
      const locality = l.locality !== null ? ` - ${l.locality}` : "";
      const department =
        l.location?.parent !== undefined ? l.location.parent.name : "";

      return `${department}${municipality}${locality}`;
    })
    .join(" / ");

  return (
    <div className="flex flex-col h-full md:flex-row-reverse">
      <div className="w-full">
        <div
          className="relative w-full h-[120px] md:h-[260px] bg-primary"
          style={{
            ...(initiativeInfo?.bannerUrl
              ? { backgroundImage: `url('${initiativeInfo?.bannerUrl}')` }
              : {}),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-2 md:top-6 right-2 md:right-6">
            <JoinInitiativeRequestButton />
          </div>
        </div>

        <main className="w-full max-w-[800px] mx-auto p-4 md:p-8">
          <header>
            <h3 className="flex flex-col text-5xl uppercase">
              {initiativeInfo.name}
              <abbr
                title={`Nombre corto de ${initiativeInfo.name}`}
                className="text-lg normal-case font-normal no-underline"
              >
                {initiativeInfo.shortName}
              </abbr>
            </h3>

            <div title="Personas que hacen parte de la iniciativa">
              {initiativeInfo.users
                .map((u) => u.externalData.fullName)
                .join(", ")}
            </div>

            <div>
              <time
                title="Fecha de registro de la iniciativa"
                dateTime={datetime}
              >
                Desde {renderDate}
              </time>{" "}
              /{" "}
              <address
                title="Ubicación de la iniciativa"
                className="not-italic inline"
              >
                {initiativeLocations}
              </address>
            </div>

            <Stats />
          </header>
          {Object.entries(initiativeInfo ?? {}).map(([k, v]) => (
            <div key={k}>
              <span>{k}: </span>
              <span className="font-bold">
                {typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
              </span>
            </div>
          ))}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a
            fringilla sem. Duis lobortis ante vitae arcu faucibus suscipit. In
            sollicitudin felis hendrerit facilisis mattis. Proin elementum
            molestie purus, non aliquam urna elementum at. Duis lobortis porta
            ornare. Vivamus vitae odio in urna aliquet porta vitae non massa.
            Curabitur dui dolor, mattis mollis odio ac, pharetra convallis
            ligula. Ut tellus sem, porttitor eu nisi vitae, mollis aliquam
            risus. Pellentesque et venenatis sem. Vestibulum faucibus tincidunt
            massa a feugiat. Sed gravida tristique vestibulum. Maecenas feugiat
            velit sit amet magna scelerisque rhoncus. Nulla tortor quam,
            fringilla vitae iaculis eget, consequat eu lectus. Nunc purus lorem,
            mollis a fermentum id, vehicula ac sapien. Ut sed nunc tellus.{" "}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a
            fringilla sem. Duis lobortis ante vitae arcu faucibus suscipit. In
            sollicitudin felis hendrerit facilisis mattis. Proin elementum
            molestie purus, non aliquam urna elementum at. Duis lobortis porta
            ornare. Vivamus vitae odio in urna aliquet porta vitae non massa.
            Curabitur dui dolor, mattis mollis odio ac, pharetra convallis
            ligula. Ut tellus sem, porttitor eu nisi vitae, mollis aliquam
            risus. Pellentesque et venenatis sem. Vestibulum faucibus tincidunt
            massa a feugiat. Sed gravida tristique vestibulum. Maecenas feugiat
            velit sit amet magna scelerisque rhoncus. Nulla tortor quam,
            fringilla vitae iaculis eget, consequat eu lectus. Nunc purus lorem,
            mollis a fermentum id, vehicula ac sapien. Ut sed nunc tellus.{" "}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a
            fringilla sem. Duis lobortis ante vitae arcu faucibus suscipit. In
            sollicitudin felis hendrerit facilisis mattis. Proin elementum
            molestie purus, non aliquam urna elementum at. Duis lobortis porta
            ornare. Vivamus vitae odio in urna aliquet porta vitae non massa.
            Curabitur dui dolor, mattis mollis odio ac, pharetra convallis
            ligula. Ut tellus sem, porttitor eu nisi vitae, mollis aliquam
            risus. Pellentesque et venenatis sem. Vestibulum faucibus tincidunt
            massa a feugiat. Sed gravida tristique vestibulum. Maecenas feugiat
            velit sit amet magna scelerisque rhoncus. Nulla tortor quam,
            fringilla vitae iaculis eget, consequat eu lectus. Nunc purus lorem,
            mollis a fermentum id, vehicula ac sapien. Ut sed nunc tellus.{" "}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a
            fringilla sem. Duis lobortis ante vitae arcu faucibus suscipit. In
            sollicitudin felis hendrerit facilisis mattis. Proin elementum
            molestie purus, non aliquam urna elementum at. Duis lobortis porta
            ornare. Vivamus vitae odio in urna aliquet porta vitae non massa.
            Curabitur dui dolor, mattis mollis odio ac, pharetra convallis
            ligula. Ut tellus sem, porttitor eu nisi vitae, mollis aliquam
            risus. Pellentesque et venenatis sem. Vestibulum faucibus tincidunt
            massa a feugiat. Sed gravida tristique vestibulum. Maecenas feugiat
            velit sit amet magna scelerisque rhoncus. Nulla tortor quam,
            fringilla vitae iaculis eget, consequat eu lectus. Nunc purus lorem,
            mollis a fermentum id, vehicula ac sapien. Ut sed nunc tellus.{" "}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a
            fringilla sem. Duis lobortis ante vitae arcu faucibus suscipit. In
            sollicitudin felis hendrerit facilisis mattis. Proin elementum
            molestie purus, non aliquam urna elementum at. Duis lobortis porta
            ornare. Vivamus vitae odio in urna aliquet porta vitae non massa.
            Curabitur dui dolor, mattis mollis odio ac, pharetra convallis
            ligula. Ut tellus sem, porttitor eu nisi vitae, mollis aliquam
            risus. Pellentesque et venenatis sem. Vestibulum faucibus tincidunt
            massa a feugiat. Sed gravida tristique vestibulum. Maecenas feugiat
            velit sit amet magna scelerisque rhoncus. Nulla tortor quam,
            fringilla vitae iaculis eget, consequat eu lectus. Nunc purus lorem,
            mollis a fermentum id, vehicula ac sapien. Ut sed nunc tellus.{" "}
          </p>
        </main>
      </div>
      <div className="bg-accent h-full min-h-[300px] w-full min-w-[250px] md:max-w-[500px]">
        mapa
      </div>
    </div>
  );
}
