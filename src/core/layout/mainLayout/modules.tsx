import Search from "@assets/modules/ico/consulta-geografica.svg";
import Indicators from "@assets/modules/ico/indicadores-biodiversidad.svg";
import Portfolio from "@assets/modules/ico/portafolio.svg";
import Monitoring from "@assets/modules/ico/monitoreo-comunitario.svg";
import Compensations from "@assets/modules/ico/compensacion-ambiental.svg";

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
    image: Search,
    link: "/Consultas",
    authModule: false,
  },
  {
    id: 2,
    title: "Monitoreo Comunitario",
    image: Monitoring,
    link: "/Monitoreo",
    authModule: false,
  },
  {
    id: 3,
    title: "Indicadores de Biodiversidad",
    image: Indicators,
    link: "/Indicadores",
    authModule: false,
  },
  {
    id: 4,
    title: "Portafolios",
    image: Portfolio,
    link: "/Portafolios",
    authModule: false,
  },
  {
    id: 5,
    title: "Compensación Ambiental",
    image: Compensations,
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
