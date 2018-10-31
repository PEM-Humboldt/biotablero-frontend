
# BioTablero
Repositorio que almacena la versión en desarrollo del servicio de Front-End del BioTablero.

Este proyecto ha sido desarrollado por el Instituto Humboldt http://www.humboldt.org.co, utilizando El proyecto fue desarrollado usando [Node.js](https://nodejs.org/) versión 8.10 y [React.js](https://reactjs.org) versión 3.5.2, junto a paquetes como [Create React App](https://github.com/facebookincubator/create-react-app), [React-scripts](https://www.npmjs.com/package/react-scripts) [D3](https://d3js.org), [Material-UI](https://material-ui.com), [VX](https://vx-demo.now.sh/), [Leaflet](https://leafletjs.com/), [React-leaflet](https://react-leaflet.js.org) y [Axios](https://alligator.io/react/axios-react/)

## 1. Instrucciones

Debe tener instalado npm o yarn en su equipo local, para la instalación de paquetes y ejecución del proyecto. Clone el proyecto en su equipo e ingrese por línea de comandos al directorio donde clonó el repositorio.

### 1.1. Instalación de paquetes:
Dentro del directorio del repositorio, inicie línea de comandos y ejecute la siguiente línea para instalar las dependencias del proyecto:

    npm install


### 1.2. Ejecución:
Posterior a la instalación de paquetes, deberá crear una copia del archivo *.env* con el nombre *.env.local*, y actualice los valores de las variables, de acuerdo a su entorno de desarrollo.

Por último, ejecute la siguiente instrucción:

    npm start

La instrucción iniciará el proyecto en su equipo local y se abrirá en el navegador.

### 1.3. Verificar reglas de estilo (airbnb)

Ejecutar la siguiente linea:

    npm run lint -- <folder/archivo>

Reemplazar <folder/archivo> con el path del folder o del archivo sobre el cual desea verificar los estilos.

### 1.4. Problemas

En caso de tener inconvenientes al ejecutar npm start en ubuntu revisar [este issue](https://github.com/facebook/create-react-app/issues/2549#issuecomment-315678389).

## 2. Despliegue con Docker

Para desplegar como contenedor de Docker es necesario contar la versión 17.05.0 o superior de [Docker](https://www.docker.com/)

### 2.1. Construcción de la imagen

Descargar el repositorio en el servidor donde se desplegará el servicio.

Tenga en cuenta la configuración de [las variables de entorno](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables): se deberá crear una copia del archivo *.env* con el nombre *.env.production.local*, y actualizar los valores de las variables, de acuerdo a su entorno de despliegue.

Ejecutar la siguiente instrucción para construir la imagen:

    docker build -t <nombre imagen>:<version> .

Es recomendable usar la versión del release en la versión de la imagen que se está construyendo.

### 2.2. Despliegue del servicio

Una vez esté creada la imagen, se despliega de la siguiente manera:

    docker run -it -d  -p <puerto host>:5000 --name <nombre contenedor> <nombre imagen>

***

*Ingeniería de Datos y Desarrollo
Programa de Evaluación y Monitoreo de la Biodiversidad
Instituto Humboldt Colombia*
