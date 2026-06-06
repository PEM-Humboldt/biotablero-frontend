import { modulesIconsDictionary } from "./header/layout/modulesIconsDictionary";

interface Module {
  id: number;
  title: string;
  image: string;
  link: string | ((username: string) => string);
  authModule: boolean;
  imgSrc: string;
  featureFlag?: string;
}

export interface DisplayModule extends Module {
  link: string;
}

const modules: Module[] = [
  {
    id: 1,
    title: "Consultas Geográficas",
    image: modulesIconsDictionary["search"],
    link: "/Consultas",
    authModule: false,
    imgSrc: "src/core/assets/geografico.png",
  },
  {
    id: 2,
    title: "Monitoreo Comunitario",
    image: modulesIconsDictionary["monitoring"],
    link: "/Monitoreo",
    authModule: false,
    imgSrc: "src/core/assets/mcomunitario.png",
    featureFlag: "CBMModule",
  },
  {
    id: 3,
    title: "Indicadores de Biodiversidad",
    image: modulesIconsDictionary["indicators"],
    link: "/Indicadores",
    authModule: false,
    imgSrc: "src/core/assets/indicadores.png",
  },
  {
    id: 4,
    title: "Portafolios",
    image: modulesIconsDictionary["portfolios"],
    link: "/Portafolios",
    authModule: false,
    imgSrc: "src/core/assets/portafolios.png",
  },
  {
    id: 5,
    title: "Compensación Ambiental",
    image: modulesIconsDictionary["compensations"],
    link: (username: string) => `/${username.toUpperCase()}/Compensaciones`,
    authModule: true,
    imgSrc: "src/core/assets/compensaciones.png",
  },
  {
    id: 6,
    title: "Alertas Tempranas",
    image: modulesIconsDictionary["alert"],
    link: "/Alertas",
    authModule: false,
    imgSrc: "src/core/assets/alertas.png",
    featureFlag: "alertsModule",
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
