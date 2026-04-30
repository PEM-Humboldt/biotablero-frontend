export const helperInfo: Record<
  string,
  {
    title: string;
    mdText: string;
    btnLabel: string;
    viewMore?: { title: string; mdText: string }[];
  } & ({ type: "files"; fileType: string[] } | { type: "links" })
> = {
  pdf: {
    type: "files",
    fileType: [".pdf"],
    title: "Documento (PDF)",
    btnLabel: "Documento",
    mdText: `
Tu archivo debe estar en formato PDF. Si tienes el documento en Google Docs o en otro procesador de texto, primero conviértelo a PDF antes de subirlo.

* **Formato:** tu archivo debe terminar en .pdf.
* **Peso:** máximo 10 MB. Si pesa más, reduce la calidad de las imágenes dentro del documento antes de convertirlo.
* **Nombre del archivo:** usa un nombre claro y sin caracteres especiales. Ejemplo: *Guia\_Monitoreo\_Agua\_2025.pdf*
* **Contenido:** revisa que esté completo y actualizado antes de subirlo.
`,
    viewMore: [
      {
        title: "Cómo convertir un documento de Google Docs a PDF ",
        mdText: `
**Desde computador:**
* Abre tu documento en Google Docs.
* Haz clic en **Archivo** (esquina superior izquierda).
* Selecciona **Descargar**.
* Elige **Documento PDF (.pdf)**.
* El archivo se descarga a tu dispositivo. Ese es el archivo que debes subir a BioTablero.

**Desde celular (app de Google Docs):**
* Abre el documento en la app.
* Toca los tres puntos (⋮) en la esquina superior derecha..
* Selecciona **Compartir y exportar** \> **Guardar como...** y elige PDF.`,
      },
      {
        title: "Cómo reducir el peso de un PDF",
        mdText: `
Si tu PDF pesa más de 10 MB, casi siempre es porque tiene imágenes muy pesadas adentro. Tienes dos opciones:

**Opción 1 \- Antes de generar el PDF:**

En el documento original (Google Docs u otro), reduce el tamaño de cada imagen antes de exportarlo. Si insertaste fotos directas del celular, redúcelas a un tamaño más razonable.

**Opción 2 \- Usando una herramienta gratuita en línea:**

Puedes usar herramientas gratuitas como ilovepdf.com o smallpdf.com para comprimir un PDF existente. Sube tu archivo, elige “Comprimir PDF” y descarga el resultado.`,
      },
    ],
  },
  pptx: {
    type: "files",
    fileType: [".pptx"],
    title: "Presentación (PPTX)",
    btnLabel: "Presentación",
    mdText: `
Las presentaciones se suben como archivo PPTX para que otras iniciativas puedan abrirlas y adaptarlas. Si hiciste tu presentación en Google Slides, descárgala como PPTX antes de subirla.

* **Formato:** tu archivo debe terminar en .pptx.
* **Peso:** máximo 10 MB. Si tu presentación tiene muchas imágenes y pesa más, reduce el tamaño de las imágenes antes de guardar.
* **Nombre del archivo:** usa un nombre claro y sin caracteres especiales. Ejemplo: *Taller3\_Analisis\_Datos\_2025.pptx*
* **Revisión:** antes de subir, abre el archivo y revisa que las imágenes y textos se vean como esperas.
`,
    viewMore: [
      {
        title: "Cómo descargar una presentación de Google Slides como PPTX",
        mdText: `
**Desde computador:**

* Abre tu presentación en Google Slides.
* Haz clic en **Archivo**.
* Selecciona **Descargar**.
* Elige **Microsoft PowerPoint (.pptx)**.
* El archivo se descarga a tu dispositivo.

**Desde celular:**
Toca los tres puntos (⋮) en la esquina superior derecha, selecciona Compartir y exportar \> Guardar como PowerPoint (.pptx).
`,
      },
      {
        title: "Cómo reducir el tamaño de las imágenes en una presentación",
        mdText: `
Antes de insertar una imagen a tu presentación, redúcela con una herramienta gratuita en línea como tinypng.com o squoosh.app: sube la imagen, descarga la versión comprimida y luego insértala en tu presentación.

Si las imágenes ya están insertadas y no quieres reemplazarlas una por una, puedes exportar la presentación como PDF y comprimirla después (ver sección 5.2), pero entonces ya no será editable y debes subirla como PDF, no como PPTX.
`,
      },
    ],
  },
  xlsx: {
    type: "files",
    fileType: [".xlsx", ".csv"],
    title: "Hoja de cálculo (XLSX o CSV)",
    btnLabel: "Hoja de cálculo",
    mdText:
      "Las hojas de cálculo sirven para compartir tablas de datos o plantillas de registro. Si trabajas en Google Sheets, descarga tu hoja como XLSX o CSV antes de subirla.\n\n* **Formato:** tu archivo debe terminar en .xlsx o .csv.\n* **Peso:** máximo 10 MB.\n* **Nombre del archivo:** usa un nombre claro y sin caracteres especiales. Ejemplo: *Calidad\_Agua\_2025.xlsx*\n* **Primera fila:** debe tener los nombres de las columnas (encabezados). Por ejemplo: *Especie, Fecha, Estación, Cantidad*.\n* **Limpieza:** no dejes filas vacías al inicio, no mezcles datos con comentarios en las mismas celdas y evita fórmulas que dependan de otras hojas externas.\n* **Si es una plantilla para recolección:** añade una segunda hoja o una nota explicando qué debe ir en cada columna, para que otras iniciativas puedan usarla.\n\n**Enlaces “Ver más”:**\n* Cómo descargar una hoja de Google Sheets como XLSX o CSV (ver sección 5.5)\n* Cómo preparar una tabla limpia en Google Sheets (ver sección 5.6)",
    viewMore: [
      {
        title: "Cómo descargar una hoja de Google Sheets como XLSX o CSV",
        mdText: `
* Abre tu hoja en Google Sheets.
* Haz clic en **Archivo**.
* Selecciona **Descargar**.
* Elige **Microsoft Excel (.xlsx)** o **Valores separados por comas (.csv)** según lo que necesites.

**¿Cuál elijo?**
* **.xlsx:** conserva varias hojas, formatos, colores y fórmulas. Ideal para plantillas complejas.
* **.csv:** guarda solo una hoja como texto plano. Más liviano y compatible con cualquier sistema. Ideal para datos simples.
`,
      },
      {
        title: "Cómo preparar una tabla limpia en Google Sheets",
        mdText: `
* **Una fila por registro:** cada fila debe representar una observación (un avistamiento, una estación muestreada, un hogar encuestado).
* **Una columna por variable:** cada columna debe contener un solo tipo de dato (Especie, Fecha, Cantidad, etc.).
* **Encabezados claros en la primera fila:** nombres cortos y descriptivos, sin espacios al inicio o al final.
* **No mezcles datos con notas:** si tienes un comentario sobre una fila, crea una columna llamada “Observaciones” en lugar de escribirlo dentro de una celda de datos.
* **Evita celdas combinadas:** dificultan el procesamiento posterior del archivo.
* **Fechas en formato consistente:** elige un formato (recomendamos DD/MM/AAAA) y úsalo en toda la columna.
`,
      },
    ],
  },
  video: {
    type: "links",
    title: "Video (YouTube)",
    btnLabel: "Video",
    mdText: `
Para compartir un video, primero súbelo a YouTube y luego pega el enlace aquí. BioTablero mostrará el video embebido en la ficha del recurso.

* **Plataforma:** el video debe estar en YouTube, público o como “No listado”.
* **Copia el enlace** desde la barra del navegador (donde aparece la dirección web) o desde el botón “Compartir” de YouTube.
* **Pega el enlace completo** en el campo. Debe empezar con *https://www.youtube.com/watch?v=...* o con *https://youtu.be/...*.
* **Verifica** que el video se pueda ver: ábrelo en una ventana de incógnito o desde otro dispositivo.`,
    viewMore: [
      {
        title: "Cómo copiar el enlace de un video en YouTube",
        mdText: `
**Desde computador:**
* Abre el video en YouTube.
* Haz clic en el botón **Compartir** (debajo del video).
* Haz clic en **Copiar**.

O copia directamente la dirección completa de la barra del navegador mientras el video está abierto.

**Desde celular:**
* Abre el video en la app o en el navegador.
* Toca el ícono de **Compartir** (una flecha curva).
* Selecciona **Copiar enlace**.
`,
      },
      {
        title: "Qué significa “No listado” en YouTube y cuándo conviene usarlo",
        mdText: `
YouTube ofrece tres niveles de privacidad para los videos:

* **Público:** cualquiera puede encontrar y ver el video.
* **No listado:** solo las personas que tengan el enlace pueden ver el video. No aparece en búsquedas.
* **Privado:** solo tú y las personas a quienes invites pueden verlo.

Para compartir en BioTablero, el video debe estar público o no listado. “No listado” es útil cuando quieres compartir el video con las personas que lleguen a BioTablero sin que aparezca en búsquedas generales de YouTube.
`,
      },
    ],
  },
  audio: {
    type: "links",
    title: "Audio / Podcast",
    btnLabel: "Audio",
    mdText: `
Para compartir un audio o podcast, publícalo primero en una plataforma como Spotify, SoundCloud o Anchor, y luego pega el enlace aquí.

* **Plataforma:** el audio debe estar publicado en Spotify, SoundCloud, Anchor u otra plataforma pública.
* **Copia el enlace de compartir** del episodio o de la pista (no el enlace del perfil o del programa completo).
* **Pega el enlace completo** en el campo. Debe incluir el dominio de la plataforma. Ejemplo: *https://open.spotify.com/episode/...
* **Verifica** que el enlace se pueda abrir sin iniciar sesión.
`,
    viewMore: [
      {
        title: "Cómo copiar el enlace de un episodio en Spotify",
        mdText: `
**Desde computador:**

* Abre el episodio en Spotify web o en la aplicación.
* Haz clic en los tres puntos (•••) al lado del nombre del episodio.
* Selecciona **Compartir** \> **Copiar enlace del episodio**.

**Desde celular:**

* Abre el episodio en la app de Spotify.
* Toca los tres puntos (•••) en la pantalla del episodio.
* Selecciona **Compartir** \> **Copiar enlace**.
`,
      },
      {
        title: "Cómo copiar el enlace de un audio en SoundCloud",
        mdText: `
* Abre el audio en SoundCloud (desde computador o celular).
* Haz clic o toca el botón **Share** (Compartir).
* Copia el enlace que aparece en la pestaña “Share”.
`,
      },
    ],
  },
  website: {
    type: "links",
    title: "Sitio web",
    btnLabel: "Sitio web",
    mdText:
      "Para compartir una convocatoria, una ley, una página institucional o cualquier otra página web, pega el enlace directamente.\n\n* **Copia el enlace completo** de la página desde la barra de direcciones del navegador.\n* **El enlace debe empezar con https://.** Si empieza con *http://* (sin la “s”), verifica que el sitio sea confiable antes de compartirlo.\n* **Acceso público:** asegúrate de que la página no requiera contraseña o registro para ser vista.\n* **Si es una convocatoria con fecha límite,** menciónalo en la descripción del recurso para que otras iniciativas sepan hasta cuándo aplica.",
  },
} as const;
