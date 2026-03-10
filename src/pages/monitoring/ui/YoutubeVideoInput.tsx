import {
  type MutableRefObject,
  type KeyboardEvent,
  useState,
  useEffect,
  ChangeEvent,
} from "react";

import {
  getYoutubeVideoMetadata,
  type YoutubeVideoMetadata,
} from "pages/monitoring/api/services/youtube";
import { isYoutubeVideoMetadata } from "pages/monitoring/api/types/guards";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import type { VideoObjectTS } from "pages/monitoring/types/territoryStory";
import type { ApiRequestError } from "@appTypes/api";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { ExternalLink, SquarePen, Trash2 } from "lucide-react";

export function YoutubeVideoInput({
  maxVideosAmmount,
  videosUrl,
}: {
  maxVideosAmmount: number;
  videosUrl?: MutableRefObject<VideoObjectTS[] | null>;
}) {
  const [errors, setErrors] = useState<null | string[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrlOrID, setVideoUrlOrID] = useState<string>("");
  const [videoCardsInfo, setVideoCardsInfo] = useState<
    (YoutubeVideoMetadata | ApiRequestError)[]
  >([]);

  const getVideo = async (UrlOrID: string) => {
    setIsLoading(true);

    const videoMetadata = await getYoutubeVideoMetadata(UrlOrID);
    if (!isYoutubeVideoMetadata(videoMetadata)) {
      setErrors((oldErr) => [...(oldErr ?? []), videoMetadata.data[0].msg]);
      setIsLoading(false);
      return;
    }

    setErrors(null);
    setIsLoading(false);
    return videoMetadata;
  };

  useEffect(() => {
    if (!videosUrl) {
      return;
    }

    const loadVideoCards = async () => {
      if (videosUrl.current === null) {
        return;
      }

      const promiseVideosInfo = videosUrl.current.map((video) =>
        getVideo(video.fileUrl),
      );

      const videosInfo = await Promise.all(promiseVideosInfo);
      setVideoCardsInfo(videosInfo);
    };

    void loadVideoCards();
  }, [videosUrl]);

  const validateVideo = async () => {
    const videoInfo = await getVideo(videoUrlOrID);
    if (!videoInfo) {
      return;
    }
    setVideoUrlOrID("");
    setVideoCardsInfo((oldCards) => [...oldCards, videoInfo]);
  };

  const handleOnKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    await validateVideo();
  };

  const handleOnChage = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrlOrID(e.target.value);
    setErrors(null);
  };

  return (
    <div>
      {videoCardsInfo.length > 0 &&
        videoCardsInfo.map((video) => {
          return isYoutubeVideoMetadata(video) ? (
            <VideoPreviewCard key={video.id} videoInfo={video} />
          ) : (
            <VideoLoadError errorInfo={video} />
          );
        })}

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
          className="mr-1!"
          onClick={() => void validateVideo()}
        >
          Añadir video
        </InputGroupButton>
      </InputGroup>
    </div>
  );
}

function VideoPreviewCard({ videoInfo }: { videoInfo: YoutubeVideoMetadata }) {
  return (
    <div className="flex gap-2 items-center p-2 rounded-lg border border-primary bg-muted space-y-2">
      <img
        src={videoInfo.thumbnail}
        alt=""
        className="h-40 aspect-video object-cover rounded"
      />
      <div className="flex  flex-col gap-2 justify-between">
        <div>
          <span
            title={`Título: ${videoInfo.title}`}
            className="block font-normal"
          >
            {videoInfo.title}
          </span>
          <span title={`Autor: ${videoInfo.author}`}>{videoInfo.author}</span>
        </div>
        <div className="text-right">
          <Button size="icon-sm" variant="ghost-clean">
            <span className="sr-only">abrir en una ventana nueva</span>
            <ExternalLink />
          </Button>
          <Button size="icon-sm" variant="ghost-clean">
            <span className="sr-only">Actualizar enlace del video</span>
            <SquarePen />
          </Button>
          <Button size="icon-sm" variant="ghost-clean">
            <span className="sr-only">Borrar</span>
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}

function VideoLoadError({ errInfo }: { errInfo: ApiRequestError }) {
  return <div>{errInfo.message}</div>;
}
