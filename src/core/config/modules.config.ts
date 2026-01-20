import Search from "@assets/modules/ico/consulta-geografica.svg";
import Indicators from "@assets/modules/ico/indicadores-biodiversidad.svg";
import Portfolio from "@assets/modules/ico/portafolio.svg";
import Monitoring from "@assets/modules/ico/monitoreo-comunitario.svg";
import Compensations from "@assets/modules/ico/compensacion-ambiental.svg";

export enum ModuleRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    AUTH_USER = 'AUTH_USER',
    ADMIN_GENERAL = "BT_ADMIN_GENERAL",
    ADMIN_COMP_AMB = 'BT_ADMIN_COMP_AMB',
    ADMIN_MONIT_COM = "BT_ADMIN_MONIT_COM",
}

interface Module {
    id: number;
    title: string;
    image: string;
    link: string | ((username: string) => string);
    authModule: boolean;
    requiredRoles?: string[];
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
        authModule: true,
        requiredRoles: [ModuleRole.ADMIN_MONIT_COM, ModuleRole.ADMIN_GENERAL],
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
        requiredRoles: [ModuleRole.ADMIN_COMP_AMB, ModuleRole.ADMIN_GENERAL],
    },
];

/**
 * Filtra y retorna los módulos que el usuario puede ver
 * 
 * @param isAuthenticated - Si el usuario está autenticado
 * @param userRoles - Array de roles del usuario (desde Keycloak)
 * @param username - Nombre de usuario (para links dinámicos)
 * @param company - Empresa del usuario (opcional)
 * @returns Array de módulos que el usuario puede ver
 */
export function displayModules(
    isAuthenticated: boolean,
    userRoles: string[] = [],
    username?: string,
    company?: string,
): DisplayModule[] {
    return modules
        .filter((module) => {
            if (!module.authModule) {
                return true;
            }

            if (module.authModule && !isAuthenticated) {
                return false;
            }

            if (!module.requiredRoles || module.requiredRoles.length === 0) {
                return isAuthenticated;
            }

            const hasRequiredRole = module.requiredRoles.some((requiredRole) =>
                userRoles.includes(requiredRole)
            );

            return hasRequiredRole;
        })
        .map((module) => ({
            ...module,
            link:
                typeof module.link === "function" && username !== undefined
                    ? module.link(username)
                    : (module.link as string),
        }) as DisplayModule);
}

export function hasModuleAccess(
    moduleId: number,
    isAuthenticated: boolean,
    userRoles: string[] = [],
): boolean {
    const module = modules.find((m) => m.id === moduleId);

    if (!module) return false;
    if (!module.authModule) return true;
    if (!isAuthenticated) return false;
    if (!module.requiredRoles || module.requiredRoles.length === 0) return true;

    return module.requiredRoles.some((role) => userRoles.includes(role));
}

export default modules;