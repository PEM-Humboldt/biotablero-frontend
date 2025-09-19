import Consultasgeograficas from "images/consulta-geografica-logo.svg";
import Indicadores from "images/indicadores-biodiversidad-icono.svg";
import Portafolio from "images/portafolio-icono.svg";
import Comunitario from "images/monitoreo-comunitario-icono.svg";
import CompensacionAmbiental from "images/compensacion-ambiental-icono.svg";
import type { UserType } from "app/uim/types";

interface Module {
  id: number;
  title: string;
  image: string;
  link: string | ((username: string) => string);
  authModule: boolean;
}

export interface DisplayModule extends Module {
  link: string;
}

const modules: Module[] = [
  {
    id: 1,
    title: "Consultas Geográficas",
    image: Consultasgeograficas,
    link: "/Consultas",
    authModule: false,
  },
  {
    id: 2,
    title: "Monitoreo Comunitario",
    image: Comunitario,
    link: "/Monitoreo",
    authModule: false,
  },
  {
    id: 3,
    title: "Indicadores de Biodiversidad",
    image: Indicadores,
    link: "/Indicadores",
    authModule: false,
  },
  {
    id: 4,
    title: "Portafolios",
    image: Portafolio,
    link: "/Portafolios",
    authModule: false,
  },
  {
    id: 5,
    title: "Compensación Ambiental",
    image: CompensacionAmbiental,
    link: (username: string) => `/${username.toUpperCase()}/Compensaciones`,
    authModule: true,
  },
];

export function displayModules(
  username?: string,
  company?: string,
): DisplayModule[] {
  const renderSpecialModule = username !== undefined && company !== undefined;
  return modules
    .filter(
      (module) =>
        !module.authModule || (module.authModule && renderSpecialModule),
    )
    .map(
      (module) =>
        ({
          ...module,
          link:
            typeof module.link === "function" && username !== undefined
              ? module.link(username)
              : (module.link as string),
        }) as DisplayModule,
    );
}
