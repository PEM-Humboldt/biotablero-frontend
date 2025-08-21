# BioTablero

Front-End de BioTablero.

Este proyecto ha sido desarrollado por el [Instituto Humboldt](http://www.humboldt.org.co). El proyecto usa [React.js](https://reactjs.org).

## 1. Instrucciones

### 1.1. Prerequisitos

Debe tener instalado [nodejs](https://nodejs.org/) v22.12+

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

### 1.2. Instalación de paquetes

Ejecute la siguiente sentencia para instalar las dependencias del proyecto:

```sh
pnpm install
```

### 1.3. Configuración de variables de entorno

Crear una copia del archivo _.env_ con el nombre _.env.local_ actualizando los valores de las variables, de acuerdo a su entorno de desarollo.

- No olvide pedirle al admin los valores de las variables de entorno.

```sh
VITE_BACKEND_URL=''
VITE_GEOSERVER_URL=''
VITE_BACKEND_KEY=''
VITE_ENVIRONMENT='develop|staging|production'
VITE_API_KEY=''
VITE_DOMAIN=''
VITE_PROJECT_ID=''
VITE_STORAGE_BUCKET=''
VITE_SENDER_ID=''
VITE_APP_ID=''
VITE_SEARCH_BACKEND_URL=''
VITE_GA_TRACKING_ID=''
VITE_YM_ID=''

```

### 1.4. Ejecución

Por último, ejecute la siguiente instrucción:

```sh
pnpm dev
```

La instrucción iniciará el proyecto en su entorno local en el puerto 3000, para abrirlo puedes ir a [http://localhost:3000](http://localhost:3000), o, oprimir `o + [Enter]` en el terminal donde está corriendo Vite.

## 2. Despliegue con Docker

Para desplegar como contenedor de Docker es necesario contar la versión 17.05.0 o superior de [Docker](https://www.docker.com/)

### 2.1. Construcción de la imagen

Descargar el repositorio en el servidor donde se desplegará el servicio.

Tenga en cuenta la configuración de las variables de entorno: se deberá crear una copia del archivo _.env_ con el nombre _.env.production.local_, y actualizar los valores de las variables, de acuerdo a su entorno de despliegue.

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

### Corregir reglas de estilo

Para realizar la correción en los estilos, se deberia ejecutar lo siguiente:

```sh
npx prettier --write "(ruta archivo)"
```

---

# Autores

Gerencia de Información Científica - Dirección de conocimiento - Instituto de Investigación de Recursos Biológicos Alexander von Humboldt - Colombia

- **Erika Suárez** - [Erikasv](https://github.com/erikasv)
- **Camilo Zapata** - [cazapatamar](https://github.com/cazapatamar)
- **Manuel Galvez** - [ManuelStardust](https://github.com/ManuelStardust)
