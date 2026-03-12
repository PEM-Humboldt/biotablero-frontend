import {
  type KeyboardEvent,
  useState,
  useEffect,
  type ChangeEvent,
  useRef,
} from "react";

import {
  getYoutubeVideoMetadata,
  type YoutubeVideoCardInfo,
  type YoutubeVideoMetadata,
} from "pages/monitoring/api/services/youtube";
import { isYoutubeVideoMetadata } from "pages/monitoring/api/types/guards";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import type { VideoObjectTS } from "pages/monitoring/types/territoryStory";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { ExternalLink, Trash2 } from "lucide-react";
import { TERRITORY_STORY_MAX_YOUTUBE_VIDEOS } from "@config/monitoring";

export function YoutubeVideoInput({
  videos,
  updateVideos,
}: {
  videos: VideoObjectTS[];
  updateVideos: (updatedVideosList: VideoObjectTS[]) => void;
}) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrlOrID, setVideoUrlOrID] = useState<string>("");
  const [videoCardsInfo, setVideoCardsInfo] = useState<YoutubeVideoCardInfo[]>(
    [],
  );

  const firstLoad = useRef(true);

  const getVideo = async (UrlOrID: string) => {
    setIsLoading(true);

    const videoMetadata = await getYoutubeVideoMetadata(UrlOrID);

    setIsLoading(false);
    return videoMetadata;
  };

  useEffect(() => {
    if (firstLoad.current) {
      return;
    }

    const loadVideoCards = async () => {
      if (videos.length === 0) {
        firstLoad.current = true;
        return;
      }

      setIsLoading(true);
      setErrors([]);

      const cardsInfo: YoutubeVideoCardInfo[] = [];
      let cleanedVideos: string[] = [];

      for (const video of videos) {
        const videoInfo = await getVideo(video.fileUrl);
        if (!isYoutubeVideoMetadata(videoInfo)) {
          if (videoInfo.status >= 429) {
            cleanedVideos = [
              `${videoInfo.data[0].msg}, no grabes y vuelve a cargar la página.`,
            ];
            break;
          }

          cleanedVideos.push(
            `El video ${video.fileUrl} va a ser eliminado del relato: ${videoInfo.data[0].msg}. Para mantenerlo en la historia, haz el video público o corrige el enlace, y vuelve a agregarlo.`,
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
    <div>
      {videoCardsInfo.length > 0 && (
        <div className="space-y-2">
          {videoCardsInfo.map((video) => (
            <VideoPreviewCard
              key={video.youtubeId}
              videoInfo={video}
              removeVideo={removeVideo}
            />
          ))}
        </div>
      )}

      {videoCardsInfo.length < TERRITORY_STORY_MAX_YOUTUBE_VIDEOS && (
        <>
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
            <InputGroupButton
              size="sm"
              variant="ghost-clean"
              className="text-primary hover:text-accent"
              onClick={() => void addVideo()}
            >
              Añadir video
            </InputGroupButton>
          </InputGroup>
        </>
      )}
      <div className="text-right">
        {videoCardsInfo.length} de {TERRITORY_STORY_MAX_YOUTUBE_VIDEOS} videos
      </div>
    </div>
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
          <Button
            onClick={() => removeVideo(videoInfo.url)}
            size="icon-sm"
            variant="ghost"
            title="Borrar el video"
          >
            <span className="sr-only">Borrar</span>
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
