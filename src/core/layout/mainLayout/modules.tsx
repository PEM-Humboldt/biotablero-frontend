import Search from "@assets/modules/ico/consulta-geografica.svg";
import Indicators from "@assets/modules/ico/indicadores-biodiversidad.svg";
import Portfolio from "@assets/modules/ico/portafolio.svg";
import Monitoring from "@assets/modules/ico/monitoreo-comunitario.svg";
import Compensations from "@assets/modules/ico/compensacion-ambiental.svg";
import { displayModules } from "@config/modules.config";
import { useAuth } from "core/context/AuthContext";
import { Link } from "react-router-dom";

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

const Modules: React.FC = () => {

    // Obtener información de autenticación
  const { isAuthenticated, user } = useAuth();

  // Obtener roles del usuario
  const userRoles = user?.roles.map(role => role.toString()) || [];
  
  // Username y company (ajusta según tu implementación)
  const username = user?.username || user?.email?.split('@')[0];
  const company = user?.organization; // o como tengas guardado el dato de company

// const modules: Module[] = [
//   {
//     id: 1,
//     title: "Consultas Geográficas",
//     image: Search,
//     link: "/Consultas",
//     authModule: false,
//   },
//   {
//     id: 2,
//     title: "Monitoreo Comunitario",
//     image: Monitoring,
//     link: "/Monitoreo",
//     authModule: false,
//   },
//   {
//     id: 3,
//     title: "Indicadores de Biodiversidad",
//     image: Indicators,
//     link: "/Indicadores",
//     authModule: false,
//   },
//   {
//     id: 4,
//     title: "Portafolios",
//     image: Portfolio,
//     link: "/Portafolios",
//     authModule: false,
//   },
//   {
//     id: 5,
//     title: "Compensación Ambiental",
//     image: Compensations,
//     link: (username: string) => `/${username.toUpperCase()}/Compensaciones`,
//     authModule: true,
//   },
// ];

  // Obtener módulos filtrados según roles
  const availableModules = displayModules(
    isAuthenticated,
    userRoles,
    username,
    company
  );

// export function displayModules(
//   username?: string,
//   company?: string,
// ): DisplayModule[] {
//   const renderSpecialModule = username !== undefined && company !== undefined;
//   return modules
//     .filter(
//       (module) =>
//         !module.authModule || (module.authModule && renderSpecialModule),
//     )
//     .map(
//       (module) =>
//         ({
//           ...module,
//           link:
//             typeof module.link === "function" && username !== undefined
//               ? module.link(username)
//               : (module.link as string),
//         }) as DisplayModule,
//     );
// }

  return (
    <div className="modules-grid">
      <h2>Módulos Disponibles</h2>
      
      <div className="grid">
        {availableModules.map((module) => (
          <Link
            key={module.id}
            to={module.link}
            className="module-card"
          >
            <img src={module.image} alt={module.title} />
            <h3>{module.title}</h3>
            
            {/* Badge si es módulo protegido */}
            {module.authModule && (
              <span className="badge">Protegido</span>
            )}
          </Link>
        ))}
      </div>

      {/* Mensaje si no hay módulos disponibles */}
      {availableModules.length === 0 && (
        <div className="no-modules">
          <p>No tienes acceso a ningún módulo.</p>
          {!isAuthenticated && (
            <button onClick={() => window.location.href = '/login'}>
              Iniciar Sesión
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Modules;
