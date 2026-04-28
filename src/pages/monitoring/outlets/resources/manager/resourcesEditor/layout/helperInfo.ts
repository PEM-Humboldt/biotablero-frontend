export const helperInfo: Record<
  string,
  { title: string; mdText: string } & (
    | { type: "files"; fileType: string[] }
    | { type: "links" }
  )
> = {
  pdf: {
    type: "files",
    fileType: [".pdf"],
    title: "Documento (PDF)",
    mdText:
      "Tu archivo debe estar en formato PDF. Si tienes el documento en Google Docs o en otro procesador de texto, primero conviértelo a PDF antes de subirlo.\n\n* **Formato:** tu archivo debe terminar en .pdf.\n* **Peso:** máximo 10 MB. Si pesa más, reduce la calidad de las imágenes dentro del documento antes de convertirlo.\n* **Nombre del archivo:** usa un nombre claro y sin caracteres especiales. Ejemplo: *Guia\_Monitoreo\_Agua\_2025.pdf*\n* **Contenido:** revisa que esté completo y actualizado antes de subirlo.\n\n**Enlaces “Ver más”:**\n* Cómo convertir un documento de Google Docs a PDF (ver sección 5.1)\n* Cómo reducir el peso de un PDF (ver sección 5.2)",
  },
  pptx: {
    type: "files",
    fileType: [".pptx"],
    title: "Presentación (PPTX)",
    mdText:
      "Las presentaciones se suben como archivo PPTX para que otras iniciativas puedan abrirlas y adaptarlas. Si hiciste tu presentación en Google Slides, descárgala como PPTX antes de subirla.\n\n* **Formato:** tu archivo debe terminar en .pptx.\n* **Peso:** máximo 10 MB. Si tu presentación tiene muchas imágenes y pesa más, reduce el tamaño de las imágenes antes de guardar.\n* **Nombre del archivo:** usa un nombre claro y sin caracteres especiales. Ejemplo: *Taller3\_Analisis\_Datos\_2025.pptx*\n* **Revisión:** antes de subir, abre el archivo y revisa que las imágenes y textos se vean como esperas.\n\n**Enlaces “Ver más”:**\n* Cómo descargar una presentación de Google Slides como PPTX (ver sección 5.3)\n* Cómo reducir el tamaño de las imágenes en una presentación (ver sección 5.4)",
  },
  xlsx: {
    type: "files",
    fileType: [".xlsx", ".csv"],
    title: "Hoja de cálculo (XLSX o CSV)",
    mdText:
      "Las hojas de cálculo sirven para compartir tablas de datos o plantillas de registro. Si trabajas en Google Sheets, descarga tu hoja como XLSX o CSV antes de subirla.\n\n* **Formato:** tu archivo debe terminar en .xlsx o .csv.\n* **Peso:** máximo 10 MB.\n* **Nombre del archivo:** usa un nombre claro y sin caracteres especiales. Ejemplo: *Calidad\_Agua\_2025.xlsx*\n* **Primera fila:** debe tener los nombres de las columnas (encabezados). Por ejemplo: *Especie, Fecha, Estación, Cantidad*.\n* **Limpieza:** no dejes filas vacías al inicio, no mezcles datos con comentarios en las mismas celdas y evita fórmulas que dependan de otras hojas externas.\n* **Si es una plantilla para recolección:** añade una segunda hoja o una nota explicando qué debe ir en cada columna, para que otras iniciativas puedan usarla.\n\n**Enlaces “Ver más”:**\n* Cómo descargar una hoja de Google Sheets como XLSX o CSV (ver sección 5.5)\n* Cómo preparar una tabla limpia en Google Sheets (ver sección 5.6)",
  },
  video: {
    type: "links",
    title: "Video (YouTube)",
    mdText:
      "Para compartir un video, primero súbelo a YouTube y luego pega el enlace aquí. BioTablero mostrará el video embebido en la ficha del recurso.\n\n* **Plataforma:** el video debe estar en YouTube, público o como “No listado”.\n* **Copia el enlace** desde la barra del navegador (donde aparece la dirección web) o desde el botón “Compartir” de YouTube.\n* **Pega el enlace completo** en el campo. Debe empezar con *https://www.youtube.com/watch?v=...* o con *https://youtu.be/...*.\n* **Verifica** que el video se pueda ver: ábrelo en una ventana de incógnito o desde otro dispositivo.\n\n**Enlaces “Ver más”:**\n* Cómo copiar el enlace de un video en YouTube (ver sección 5.7)\n* Qué significa “No listado” en YouTube y cuándo conviene usarlo (ver sección 5.8)\n* Tutorial: “Cómo subir un video a YouTube desde cero” (ver sección 6.3)",
  },
  audio: {
    type: "links",
    title: "Audio / Podcast",
    mdText:
      "Para compartir un audio o podcast, publícalo primero en una plataforma como Spotify, SoundCloud o Anchor, y luego pega el enlace aquí.\n\n* **Plataforma:** el audio debe estar publicado en Spotify, SoundCloud, Anchor u otra plataforma pública.\n* **Copia el enlace de compartir** del episodio o de la pista (no el enlace del perfil o del programa completo).\n* **Pega el enlace completo** en el campo. Debe incluir el dominio de la plataforma. Ejemplo: *https://open.spotify.com/episode/...\n* **Verifica** que el enlace se pueda abrir sin iniciar sesión.\n\n**Enlaces “Ver más”:**\n* Cómo copiar el enlace de un episodio en Spotify (ver sección 5.9)\n* Cómo copiar el enlace de un audio en SoundCloud (ver sección 5.10)",
  },
  website: {
    type: "links",
    title: "Sitio web",
    mdText:
      "Para compartir una convocatoria, una ley, una página institucional o cualquier otra página web, pega el enlace directamente.\n\n* **Copia el enlace completo** de la página desde la barra de direcciones del navegador.\n* **El enlace debe empezar con https://.** Si empieza con *http://* (sin la “s”), verifica que el sitio sea confiable antes de compartirlo.\n* **Acceso público:** asegúrate de que la página no requiera contraseña o registro para ser vista.\n* **Si es una convocatoria con fecha límite,** menciónalo en la descripción del recurso para que otras iniciativas sepan hasta cuándo aplica.",
  },
} as const;
