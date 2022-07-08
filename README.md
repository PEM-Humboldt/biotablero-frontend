
# BioTablero
Front-End de BioTablero.

Este proyecto ha sido desarrollado por el [Instituto Humboldt](http://www.humboldt.org.co). El proyecto usa [React.js](https://reactjs.org).


## 1. Instrucciones

### 1.1. Prerequisitos

Debe tener instalado [nodejs](https://nodejs.org/) v14.15+ y [yarn](https://yarnpkg.com/) en su equipo local para la instalación de paquetes y ejecución del proyecto.

Clone el proyecto en su equipo e ingrese por línea de comandos al directorio del proyecto.

### 1.2. Instalación de paquetes:
Ejecute la siguiente sentencia para instalar las dependencias del proyecto:

    yarn install

### 1.3. Construcción de dependencias:
Algunas dependencias del proyecto son paquetes incluídos en este mismo repositorio, para "*compilar*" dichas dependencias ejecute:

    yarn workspaces foreach run build-pkg

### 1.4. Configuración de variables de entorno:
Crear una copia del archivo *.env* con el nombre *.env.local* actualizando los valores de las variables, de acuerdo a su entorno de desarollo.

```sh
REACT_APP_BACKEND_URL=''
REACT_APP_GEOSERVER_URL=''
REACT_APP_BACKEND_KEY=''
REACT_APP_ENVIRONMENT='develop|staging|production'
REACT_APP_API_KEY=''
REACT_APP_DOMAIN=''
REACT_APP_PROJECT_ID=''
REACT_APP_STORAGE_BUCKET=''
REACT_APP_SENDER_ID=''
REACT_APP_APP_ID=''

```

### 1.5. Ejecución:
Por último, ejecute la siguiente instrucción:

    yarn start

La instrucción iniciará el proyecto en su entorno local y se abrirá en el navegador.

### 1.6. Problemas

En caso de tener inconvenientes al ejecutar el proyecto en ubuntu revisar [este issue](https://github.com/facebook/create-react-app/issues/2549#issuecomment-315678389).

## 2. Despliegue con Docker

Para desplegar como contenedor de Docker es necesario contar la versión 17.05.0 o superior de [Docker](https://www.docker.com/)

### 2.1. Construcción de la imagen

Descargar el repositorio en el servidor donde se desplegará el servicio.

Tenga en cuenta la configuración de [las variables de entorno](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used): se deberá crear una copia del archivo *.env* con el nombre *.env.production.local*, y actualizar los valores de las variables, de acuerdo a su entorno de despliegue.

Ejecutar la siguiente instrucción para construir la imagen:

    docker build -t biotablero-front:<version> .

Es recomendable usar como versión de la imagen el valor del release actual en [GitHub](https://github.com/PEM-Humboldt/biotablero/releases).

### 2.2. Despliegue del servicio

Una vez esté creada la imagen, se despliega de la siguiente manera:

    docker run -it -d  -p <puerto host>:5000 --name <nombre contenedor> biotablero-front:<version imagen>

## 3. Utilitarios

### Desarrollo en dependencias

Para trabajar en una dependencia en específico y observar los cambios en estas, ejecute:

    yarn workspace <nombre_paquete> run build-dev

Tenga en cuenta las siguientes cosas:

- El build toma más tiempo la primera vez que se genera, pero cada vez que se detecte un cambio puede tomar aproximadamente 5seg en volver a generarse.
- Si desea habilitar el sourcemap puede hacerlo en la configuración de cada dependencia, o incluso mejor, ejecute la dependencia de forma independiente y trabaje directamente sobre ella.


### Verificar reglas de estilo

Ejecutar la siguiente linea para verificar los estilos del proyecto:

    yarn run lint

Para verificar los estilos de las dependencias propias ejecute:

    yarn workspaces foreach run lint

***

*Ingeniería de Datos y Desarrollo
Programa de Evaluación y Monitoreo de la Biodiversidad
Instituto Humboldt Colombia*
