import {
  type KeyboardEvent,
  useState,
  useEffect,
  type ChangeEvent,
} from "react";

import {
  getYoutubeVideoMetadata,
  type YoutubeVideoCardInfo,
  type YoutubeVideoMetadata,
} from "pages/monitoring/api/services/youtube";
import {
  isMonitoringAPIError,
  isYoutubeVideoMetadata,
} from "pages/monitoring/api/types/guards";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import type { VideoObjectTS } from "pages/monitoring/types/territoryStory";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { ExternalLink, SquarePen, Trash2 } from "lucide-react";
import { deleteTerritoryHistoryVideo } from "pages/monitoring/api/services/assets";
// import { TERRITORY_STORY_MAX_YOUTUBE_VIDEOS } from "@config/monitoring";

export function YoutubeVideoInput({
  videos,
}: {
  videos: Omit<VideoObjectTS, "territoryStoryId">[];
}) {
  const [errors, setErrors] = useState<null | string[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrlOrID, setVideoUrlOrID] = useState<string>("");
  const [videoCardsInfo, setVideoCardsInfo] = useState<YoutubeVideoCardInfo[]>(
    [],
  );

  const getVideo = async (UrlOrID: string) => {
    setIsLoading(true);

    const videoMetadata = await getYoutubeVideoMetadata(UrlOrID);

    setIsLoading(false);
    return videoMetadata;
  };

  useEffect(() => {
    const loadVideoCards = async () => {
      setErrors(null);
      setIsLoading(true);
      const cleanedVideos: string[] = [];
      const cardsInfo: YoutubeVideoCardInfo[] = [];

      for (const videoUrl of videos) {
        const videoInfo = await getVideo(videoUrl.fileUrl);

        if (!isYoutubeVideoMetadata(videoInfo)) {
          // NOTE: Para evitar estados raros, eliminamos los videos que
          // cargan con error por cosas de la api de youtube
          if (videoUrl.id) {
            const res = await deleteTerritoryHistoryVideo(videoUrl.id);
            if (isMonitoringAPIError(res)) {
              setErrors((oldErrs) => [
                ...(oldErrs ?? []),
                `Error al limpiar ${videoUrl.fileUrl} por ${res.data[0].msg}`,
              ]);
            }
            continue;
          }

          cleanedVideos.push(
            `El video ${videoUrl.fileUrl} fue eliminado del relato: ${videoInfo.data[0].msg}`,
          );
          continue;
        }

        cardsInfo.push(videoInfo);
      }

      setIsLoading(false);
      setErrors((oldErrs) => [...(oldErrs ?? []), ...cleanedVideos]);
      setVideoCardsInfo(cardsInfo);
    };

    void loadVideoCards();
  }, [videos]);

  const addVideo = async () => {
    const videoInfo = await getVideo(videoUrlOrID);
    if (!isYoutubeVideoMetadata(videoInfo)) {
      setErrors((oldErrs) => [...(oldErrs ?? []), videoInfo.data[0].msg]);
      return;
    }

    if (videos && new Set(videos.map((v) => v.fileUrl)).has(videoInfo.url)) {
      setErrors((oldErrs) => [
        ...(oldErrs ?? []),
        "El video ya se encuentra dentro de los medios que hacen parte del relato",
      ]);
      return;
    }

    setVideoUrlOrID("");
    videos.push({ fileUrl: videoInfo.url });
    setVideoCardsInfo((oldCards) => [...oldCards, videoInfo]);
  };

  const handleOnKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    await addVideo();
  };

  const handleOnChage = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrlOrID(e.target.value);
    setErrors(null);
  };

  return (
    <div>
      {videoCardsInfo.length > 0 && (
        <div className="space-y-2">
          {videoCardsInfo.map((video) => (
            <VideoPreviewCard key={video.youtubeId} videoInfo={video} />
          ))}
        </div>
      )}

      <LabelAndErrors
        errID="errors_youtubeVideo"
        validationErrors={errors ?? []}
        htmlFor="youtubeVideoInput"
      >
        Adjuntar video de youtube
      </LabelAndErrors>
      <InputGroup className="py-5">
        <InputGroupInput
          name="youtubeVideoInput"
          id="youtubeVideoInput"
          type="text"
          value={videoUrlOrID}
          onChange={handleOnChage}
          onKeyDown={(e) => void handleOnKeyDown(e)}
          autoComplete="off"
          placeholder="url de youtube o id del video"
          aria-invalid={errors !== null}
          aria-describedby={errors !== null ? "errors_youtubeVideo" : undefined}
          disabled={isLoading}
        />
        <InputGroupButton
          size="sm"
          variant="ghost-clean"
          className="text-primary hover:text-accent"
          onClick={() => void addVideo()}
        >
          Añadir video
        </InputGroupButton>
      </InputGroup>
    </div>
  );
}

function VideoPreviewCard({ videoInfo }: { videoInfo: YoutubeVideoMetadata }) {
  return (
    <div className="flex gap-2 p-2 rounded-lg border border-primary bg-muted space-y-2">
      <img
        src={videoInfo.thumbnail}
        alt=""
        className="h-30 m-0! aspect-video object-cover rounded"
      />
      <div className="flex flex-col w-full gap-2 justify-between">
        <div>
          <span
            title={`Título: ${videoInfo.title}`}
            className="block font-normal"
          >
            {videoInfo.title}
          </span>
          <span title={`Autor: ${videoInfo.author}`}>{videoInfo.author}</span>
        </div>
        <div className="flex items-center">
          <Button
            asChild
            variant="link"
            className="p-0! h-8 mr-auto text-primary"
            title="abrir en una ventana nueva"
          >
            <a href={videoInfo.url} target="_blank">
              abrir video
              <ExternalLink />
            </a>
          </Button>
          {videoInfo.youtubeId && (
            <Button
              size="icon-sm"
              variant="ghost"
              title="Actualizar enlace del video"
            >
              <span className="sr-only">Actualizar enlace del video</span>
              <SquarePen />
            </Button>
          )}
          <Button size="icon-sm" variant="ghost" title="Borrar el video">
            <span className="sr-only">Borrar</span>
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
