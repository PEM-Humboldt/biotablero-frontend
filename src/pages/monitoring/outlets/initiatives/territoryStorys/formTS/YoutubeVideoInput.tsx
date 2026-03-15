import {
  type KeyboardEvent,
  useState,
  useEffect,
  type ChangeEvent,
  useRef,
  useCallback,
} from "react";

import {
  getCleanYoutubeId,
  getYoutubeVideoMetadata,
  type YoutubeVideoCardInfo,
  type YoutubeVideoMetadata,
} from "pages/monitoring/api/services/youtube";
import { isYoutubeVideoMetadata } from "pages/monitoring/api/types/guards";
import type { VideoObjectTS } from "pages/monitoring/types/territoryStory";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { ExternalLink, Trash } from "lucide-react";
import { TERRITORY_STORY_YT_VID_MAX_AMOUNT } from "@config/monitoring";
import { Input } from "@ui/shadCN/component/input";

export function YoutubeVideoInput({
  videos,
  updateVideos,
  errors,
  setErrors,
}: {
  videos: VideoObjectTS[];
  updateVideos: (updatedVideosList: VideoObjectTS[]) => void;
  errors: string[];
  setErrors: (errors: string[]) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrlOrID, setVideoUrlOrID] = useState<string>("");
  const [videoCardsInfo, setVideoCardsInfo] = useState<YoutubeVideoCardInfo[]>(
    [],
  );
  const currentVideosIds = useRef<Set<string>>(new Set());

  const getVideo = async (UrlOrID: string | null) => {
    setIsLoading(true);

    const videoMetadata = await getYoutubeVideoMetadata(
      getCleanYoutubeId(UrlOrID ?? ""),
    );

    setIsLoading(false);
    return videoMetadata;
  };

  useEffect(() => {
    currentVideosIds.current = new Set(
      videoCardsInfo.map((vC) => vC.youtubeId),
    );
  }, [videoCardsInfo]);

  const loadVideoCards = useCallback(async () => {
    if (videos.length === 0) {
      return;
    }

    setIsLoading(true);
    setErrors([]);

    const newCardsInfo: YoutubeVideoCardInfo[] = [];
    let cleanedVideos: string[] = [];

    for (const video of videos) {
      const videoId = getCleanYoutubeId(video.fileUrl);
      if (currentVideosIds.current.has(videoId ?? "")) {
        continue;
      }

      const videoInfo = await getVideo(videoId);
      if (!isYoutubeVideoMetadata(videoInfo)) {
        if (videoInfo.status >= 429) {
          cleanedVideos = [
            `${videoInfo.data[0].msg}, no grabes y vuelve a cargar la página.`,
          ];
          break;
        }

        cleanedVideos.push(
          `El video ${video.fileUrl} va a ser eliminado del relato: ${videoInfo.data[0].msg}.\nPara mantenerlo en el relato, haz el video público o corrige el enlace, y vuelve a agregarlo.`,
        );

        continue;
      }

      newCardsInfo.push(videoInfo);
    }

    setIsLoading(false);
    setErrors(cleanedVideos);
    setVideoCardsInfo((oldCardsInfo) => [...oldCardsInfo, ...newCardsInfo]);
  }, [videos, currentVideosIds, setErrors]);

  useEffect(() => {
    void loadVideoCards();
  }, [loadVideoCards]);

  const addVideo = async () => {
    if (currentVideosIds.current.has(getCleanYoutubeId(videoUrlOrID) ?? "")) {
      setErrors([
        "El video ya se encuentra dentro de los medios que hacen parte del relato",
      ]);
      return;
    }

    const videoInfo = await getVideo(videoUrlOrID);

    if (!isYoutubeVideoMetadata(videoInfo)) {
      setErrors(videoInfo.data.map((err) => err.msg));
      return;
    }

    setVideoUrlOrID("");
    updateVideos([...videos, { fileUrl: videoInfo.url }]);
    setVideoCardsInfo((oldCards) => [...oldCards, videoInfo]);
  };

  const removeVideo = (url: string) => {
    setVideoCardsInfo((oldCards) =>
      oldCards.filter((card) => card.url !== url),
    );

    const updatedVideos = videos.filter((video) => video.fileUrl !== url);

    updateVideos(updatedVideos);
    setErrors([]);
  };

  const handleOnKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    await addVideo();
  };

  const handleOnInputChage = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrlOrID(e.target.value);
    setErrors([]);
  };

  return (
    <fieldset>
      <legend className="flex w-full justify-between text-primary font-normal px-2">
        <span>Adjuntar videos de youtube</span>
        <span>
          {videoCardsInfo.length} de {TERRITORY_STORY_YT_VID_MAX_AMOUNT} videos
        </span>
      </legend>

      <div className="border border-input p-2 rounded-xl">
        {videoCardsInfo.length < TERRITORY_STORY_YT_VID_MAX_AMOUNT && (
          <div>
            <LabelAndErrors
              errID="errors_youtubeVideo"
              validationErrors={errors ?? []}
              htmlFor="youtubeVideoInput"
              className="m-0 p-0"
            >
              <span className="sr-only">
                Ingresa la url o el id del video de YouTube
              </span>
            </LabelAndErrors>

            <div className="flex gap-2 items-center">
              <Input
                name="youtubeVideoInput"
                id="youtubeVideoInput"
                type="text"
                value={videoUrlOrID}
                onChange={handleOnInputChage}
                onKeyDown={(e) => void handleOnKeyDown(e)}
                autoComplete="off"
                placeholder="url de youtube o id del video"
                aria-invalid={errors.length > 0}
                aria-describedby={
                  errors.length > 0 ? "errors_youtubeVideo" : undefined
                }
                disabled={isLoading}
              />
              <Button onClick={() => void addVideo()} type="button">
                Adjuntar video
              </Button>
            </div>
          </div>
        )}

        {videoCardsInfo.length > 0 && (
          <>
            <div className="flex w-full justify-between text-primary font-normal px-2 mt-2">
              Videos adjuntos
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
              {videoCardsInfo.map((video) => (
                <VideoPreviewCard
                  key={video.youtubeId}
                  videoInfo={video}
                  removeVideo={removeVideo}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </fieldset>
  );
}

function VideoPreviewCard({
  videoInfo,
  removeVideo,
}: {
  videoInfo: YoutubeVideoMetadata;
  removeVideo: (videoUrl: string) => void;
}) {
  return (
    <div className="flex gap-2 p-2 rounded-lg bg-background/50 space-y-2">
      <img
        src={videoInfo.thumbnail}
        alt=""
        className="border border-primary/50 h-30 m-0! aspect-video object-cover rounded"
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
            type="button"
          >
            <a href={videoInfo.url} target="_blank">
              abrir video
              <ExternalLink />
            </a>
          </Button>
          <Button
            onClick={() => removeVideo(videoInfo.url)}
            size="icon-sm"
            variant="ghost"
            title="Borrar el video"
            type="button"
          >
            <span className="sr-only">Borrar</span>
            <Trash />
          </Button>
        </div>
      </div>
    </div>
  );
}
