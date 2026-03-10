import type { ApiRequestError } from "@appTypes/api";
import axios from "axios";

export type YoutubeVideoMetadata = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  url: string;
};

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

export type YoutubeError = {
  exists: false;
  error: string;
};

export const getYoutubeVideoMetadata = async (
  input: string,
): Promise<YoutubeVideoMetadata | ApiRequestError> => {
  const videoRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"&?/\s]{11})/i;
  console.log(input);
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
      id: videoId,
      title: data.title,
      author: data.author_name,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        status: 404,
        message: "Video not found",
        data: [
          {
            msg: "Video no encontrado, el id es incorrecto o el video es privado",
          },
        ],
      };
    }

    return {
      status: 500,
      message: "Unknown error",
      data: [],
    };
  }
};
