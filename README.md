# BioTablero

Front-End de BioTablero.

Este proyecto ha sido desarrollado por el [Instituto Humboldt](http://www.humboldt.org.co). El proyecto usa [React.js](https://reactjs.org).

## 1. Instrucciones

### 1.1. Prerequisitos

Debe tener instalado [nodejs](https://nodejs.org/) v18.15+

Clone el proyecto en su equipo e ingrese por línea de comandos al directorio del proyecto.

#### NVM

En caso usar nvm, puede activar la version necesaria con el siguiente comando:

```sh
nvm use

```

Si no tiene la versión correcta instalada, el comando le indicará como instalarla antes de poder usarla.

Active pnpm como el manejador de paquetes:

```sh
corepack enable
```

### 1.2. Construcción de dependencias:

Algunas dependencias del proyecto son paquetes incluidos en este mismo repositorio, para "_compilar_" dichas dependencias ejecute:

```sh
pnpm -r install
pnpm -r build-pkg
```

### 1.3. Instalación de paquetes:

Ejecute la siguiente sentencia para instalar las dependencias del proyecto:

```sh
pnpm install
```

### 1.4. Configuración de variables de entorno:

Crear una copia del archivo _.env_ con el nombre _.env.local_ actualizando los valores de las variables, de acuerdo a su entorno de desarollo.

- No olvide pedirle al admin los valores de las variables de entorno.

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
REACT_APP_BACKEND_STAC_URL=''
REACT_APP_GA_TRACKING_ID=''

```

### 1.5. Ejecución:

Por último, ejecute la siguiente instrucción:

```sh
pnpm start-dev
```

La instrucción iniciará el proyecto en su entorno local y se abrirá en el navegador.

### 1.6. Problemas

En caso de tener inconvenientes al ejecutar el proyecto en ubuntu revisar [este issue](https://github.com/facebook/create-react-app/issues/2549#issuecomment-315678389).

## 2. Despliegue con Docker

Para desplegar como contenedor de Docker es necesario contar la versión 17.05.0 o superior de [Docker](https://www.docker.com/)

### 2.1. Construcción de la imagen

Descargar el repositorio en el servidor donde se desplegará el servicio.

Tenga en cuenta la configuración de [las variables de entorno](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used): se deberá crear una copia del archivo _.env_ con el nombre _.env.production.local_, y actualizar los valores de las variables, de acuerdo a su entorno de despliegue.

Ejecutar la siguiente instrucción para construir la imagen:

```sh
docker build -t biotablero-front:<version> .
```

Es recomendable usar como versión de la imagen el valor del release actual en [GitHub](https://github.com/PEM-Humboldt/biotablero/releases).

### 2.2. Despliegue del servicio

Una vez esté creada la imagen, se despliega de la siguiente manera:

```sh
docker run -d  -p <puerto host>:5000 --name <nombre contenedor> biotablero-front:<version imagen>
```

## 3. Utilitarios

### Desarrollo en dependencias

Para trabajar en una dependencia en específico y observar los cambios en estas, ejecute:

```sh
pnpm --filter ./packages/<nombre_paquete> build-dev
```

Tenga en cuenta las siguientes cosas:

- El build toma más tiempo la primera vez que se genera, pero cada vez que se detecte un cambio puede tomar aproximadamente 5seg en volver a generarse.
- Si desea habilitar el sourcemap puede hacerlo en la configuración de cada dependencia, o incluso mejor, ejecute la dependencia de forma independiente y trabaje directamente sobre ella.

### Verificar reglas de estilo

Ejecutar la siguiente linea para verificar los estilos del proyecto:

```sh
pnpm check-format
```

Para verificar los estilos de las dependencias propias ejecute:

```sh
pnpm -r lint
```

---

# Autores

Gerencia de Información Científica - Dirección de conocimiento - Instituto de Investigación de Recursos Biológicos Alexander von Humboldt - Colombia

- **Erika Suárez** - [Erikasv](https://github.com/erikasv)
- **Camilo Zapata** - [cazapatamar](https://github.com/cazapatamar)
- **Manuel Galvez** - [ManuelStardust](https://github.com/ManuelStardust)
