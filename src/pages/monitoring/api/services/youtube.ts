import type { ApiRequestError } from "@appTypes/api";
import axios from "axios";
import { commonErrorMessage } from "pages/monitoring/api/errorsDictionary";

export type YoutubeVideoMetadata = {
  youtubeId: string;
  title: string;
  author: string;
  thumbnail: string;
  url: string;
};

export interface YoutubeVideoCardInfo extends YoutubeVideoMetadata {
  territoryStoriId?: number;
  mediaSourceId?: number;
}

type YoutubeOEmbedResponse = {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
};

const youtubeApiResponseUiMessage: Record<number, string> = {
  400: "Parámetros de consulta inválidos o ID mal formado.",
  401: "El video no está disponible para compartir libremente (No autorizado).",
  403: "Acceso prohibido: el video tiene restricciones de dominio o edad o de peticiones realizadas.",
  404: "Video no encontrado o el ID es incorrecto.",
  429: "Demasiadas solicitudes en poco tiempo. Reintenta más tarde.",
  503: "No se pudo conectar con los servidores de Google. Revisa tu conexión.",
};

export type YoutubeError = {
  exists: false;
  error: string;
};

export const getYoutubeVideoMetadata = async (
  input: string,
): Promise<YoutubeVideoMetadata | ApiRequestError> => {
  const videoRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = input.match(videoRegex);
  let videoId: string | null = null;

  if (match) {
    videoId = match[1];
  } else {
    const directIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    if (directIdRegex.test(input.trim())) {
      videoId = input.trim();
    }
  }

  if (!videoId) {
    return {
      status: 0,
      message: "Request cancelled",
      data: [
        {
          msg: "URL o id del video incorrectos, se espera una URL de youtube o el ID de 11 caracteres",
        },
      ],
    };
  }

  try {
    const { data } = await axios.get<YoutubeOEmbedResponse>(
      `https://www.youtube.com/oembed`,
      {
        params: {
          url: `https://www.youtube.com/watch?v=${videoId}`,
          format: "json",
        },
      },
    );

    return {
      youtubeId: videoId,
      title: data.title,
      author: data.author_name,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  } catch (error) {
    console.error("YoutubeApiCall:", error);

    if (!axios.isAxiosError(error)) {
      return {
        status: 500,
        message: "Unknown error",
        data: [],
      };
    }

    const status = error.response?.status ?? 500;

    return {
      status,
      message: (error.response?.data as string) || error.message,
      data: [
        {
          msg:
            youtubeApiResponseUiMessage[status] ||
            commonErrorMessage[error.response?.status ?? 500],
        },
      ],
    };
  }
};
