
# BioTablero
Repositorio que almacena servicio de Front-End del BioTablero.

Este proyecto ha sido desarrollado por el [Instituto Humboldt](http://www.humboldt.org.co). El proyecto fue desarrollado usando [Node.js](https://nodejs.org/) versión 8.10 y [React.js](https://reactjs.org) versión 3.5.2, junto a paquetes como [Create React App](https://github.com/facebookincubator/create-react-app), [React-scripts](https://www.npmjs.com/package/react-scripts) [D3](https://d3js.org), [Material-UI](https://material-ui.com), [VX](https://vx-demo.now.sh/), [Leaflet](https://leafletjs.com/), [React-leaflet](https://react-leaflet.js.org) y [Axios](https://alligator.io/react/axios-react/)

## 1. Instrucciones

Debe tener instalado npm o yarn en su equipo local, para la instalación de paquetes y ejecución del proyecto. Clone el proyecto en su equipo e ingrese por línea de comandos al directorio del proyecto.

### 1.1. Instalación de paquetes:
Ejecute la siguiente sentencia para instalar las dependencias del proyecto:

    npm install


### 1.2. Ejecución:
Posterior a la instalación de paquetes, deberá crear una copia del archivo *.env* con el nombre *.env.local*, y actualizar los valores de las variables, de acuerdo a su entorno de desarrollo.

Por último, ejecute la siguiente instrucción:

    npm start

La instrucción iniciará el proyecto en su equipo local y se abrirá en el navegador.

### 1.3. Verificar reglas de estilo (airbnb)

Ejecutar la siguiente linea:

    npm run lint -- <folder/archivo>

Reemplazar <folder/archivo> con el path del folder o del archivo sobre el cual desea verificar los estilos.

Si ejecuta únicamente:

    npm run lint

Se verificarán los estilos de todo el folder *src/*

### 1.4. Problemas

En caso de tener inconvenientes al ejecutar npm start en ubuntu revisar [este issue](https://github.com/facebook/create-react-app/issues/2549#issuecomment-315678389).

## 2. Despliegue con Docker

Para desplegar como contenedor de Docker es necesario contar la versión 17.05.0 o superior de [Docker](https://www.docker.com/)

### 2.1. Construcción de la imagen

Descargar el repositorio en el servidor donde se desplegará el servicio.

Tenga en cuenta la configuración de [las variables de entorno](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables): se deberá crear una copia del archivo *.env* con el nombre *.env.production.local*, y actualizar los valores de las variables, de acuerdo a su entorno de despliegue.

Ejecutar la siguiente instrucción para construir la imagen:

    docker build -t biotablero-front:<version> .

Es recomendable usar como versión de la imagen el valor del release actual en [GitHub](https://github.com/PEM-Humboldt/biotablero/releases).

### 2.2. Despliegue del servicio

Una vez esté creada la imagen, se despliega de la siguiente manera:

    docker run -it -d  -p <puerto host>:5000 --name <nombre contenedor> biotablero-front:<version imagen>
    
## 3. Arquitectura

A continuación se presenta el diagrama de la arquitectura de la plataforma BioTablero, que involucra el presente repositorio (biotablero-frontend).

![arquitectura](https://user-images.githubusercontent.com/15584917/50234775-6c5b4d00-0384-11e9-87af-31035994cc91.png)

### 3.1. Explicación de funcionamiento y dependencias

Este proyecto cuenta con dos dependencias que deben ser configuradas según las instrucciónes dadas para la [construcción de la imagen](https://github.com/PEM-Humboldt/biotablero#21-construcci%C3%B3n-de-la-imagen). En caso de ejecutar este proyecto sin la configuración previa, no se presentarán datos ni áreas a seleccionar sobre el mapa.

Por lo tanto, deberá configurar la carga de información desde la ejecución del backend del proyecto:
- biotablero-backend: https://github.com/PEM-Humboldt/biotablero-backend

Y deberá configurar la conexión a servicios de GeoServer para la obtención de capas de mapas.

### 3.2. Diagrama de componentes

La interacción entre componentes de este proyecto (biotablero-frontend) se describe a continuación:

![diagrama_componentes](https://user-images.githubusercontent.com/15584917/50234036-c65b1300-0382-11e9-9cbd-c36453696bf7.png)

***

*Ingeniería de Datos y Desarrollo
Programa de Evaluación y Monitoreo de la Biodiversidad
Instituto Humboldt Colombia*
