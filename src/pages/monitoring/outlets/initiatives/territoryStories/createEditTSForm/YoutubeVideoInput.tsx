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

type YoutubeVideoInputProps = {
  videos: VideoObjectTS[];
  updateVideos: (updatedVideosList: VideoObjectTS[]) => void;
  errors: string[];
  setErrors: (errors: string[]) => void;
  text: {
    title: string;
    counter: (current: number, total: number) => string;
    input: { label: string; placeholder: string; upload: string };
    videosPool: {
      title: string;
      videoTitle: (videoTitle: string) => string;
      authorTitle: (author: string) => string;
      openBtn: { title: string; label: string };
      removeBtn: { title: string; sr: string };
    };
    errorsYoutubeFeedback: {
      conection: (err: string) => string;
      purge: (url: string, why: string) => string;
      alreadyUploaded: string;
    };
  };
};

export function YoutubeVideoInput({
  videos,
  updateVideos,
  errors,
  setErrors,
  text,
}: YoutubeVideoInputProps) {
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

  const loadVideoCards = useCallback(async (videosToLoad: VideoObjectTS[]) => {
    if (videosToLoad.length === 0) {
      return;
    }

    setIsLoading(true);
    const newCardsInfo: YoutubeVideoCardInfo[] = [];

    for (const video of videosToLoad) {
      const videoId = getCleanYoutubeId(video.fileUrl);
      if (currentVideosIds.current.has(videoId ?? "")) {
        continue;
      }

      const videoInfo = await getVideo(videoId);
      if (isYoutubeVideoMetadata(videoInfo)) {
        newCardsInfo.push(videoInfo);
      }
    }

    if (newCardsInfo.length > 0) {
      setVideoCardsInfo((old) => [...old, ...newCardsInfo]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (videos.length > 0 && videoCardsInfo.length === 0) {
      void loadVideoCards(videos);
    }
  }, [videos, loadVideoCards, videoCardsInfo.length]);

  useEffect(() => {
    currentVideosIds.current = new Set(
      videoCardsInfo.map((vC) => vC.youtubeId),
    );
  }, [videoCardsInfo]);

  const addVideo = async () => {
    if (currentVideosIds.current.has(getCleanYoutubeId(videoUrlOrID) ?? "")) {
      setErrors([text.errorsYoutubeFeedback.alreadyUploaded]);
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
        <span>{text.title}</span>
        <span>
          {text.counter(
            videoCardsInfo.length,
            TERRITORY_STORY_YT_VID_MAX_AMOUNT,
          )}
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
              <span className="sr-only">{text.input.label}</span>
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
                placeholder={text.input.placeholder}
                aria-invalid={errors.length > 0}
                aria-describedby={
                  errors.length > 0 ? "errors_youtubeVideo" : undefined
                }
                disabled={isLoading}
              />
              <Button onClick={() => void addVideo()} type="button">
                {text.input.upload}
              </Button>
            </div>
          </div>
        )}

        {videoCardsInfo.length > 0 && (
          <>
            <div className="flex w-full justify-between text-primary font-normal px-2 mt-2">
              {text.videosPool.title}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {videoCardsInfo.map((video) => (
                <VideoPreviewCard
                  key={video.youtubeId}
                  videoInfo={video}
                  removeVideo={removeVideo}
                  text={{
                    videoTitle: text.videosPool.videoTitle,
                    authorTitle: text.videosPool.authorTitle,
                    openBtn: { ...text.videosPool.openBtn },
                    removeBtn: { ...text.videosPool.removeBtn },
                  }}
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
  text,
}: {
  videoInfo: YoutubeVideoMetadata;
  removeVideo: (videoUrl: string) => void;
  text: {
    videoTitle: (videoTitle: string) => string;
    authorTitle: (author: string) => string;
    openBtn: { title: string; label: string };
    removeBtn: { title: string; sr: string };
  };
}) {
  return (
    <div className="flex gap-2 p-2 rounded-lg bg-muted transition-all duration-300 ease-in-out hover:outline hover:outline-primary hover:bg-background">
      <img
        src={videoInfo.thumbnail}
        alt=""
        className="border border-primary/50 h-30 m-0! aspect-video object-cover rounded"
      />
      <div className="flex flex-col w-full gap-2 justify-between">
        <div>
          <span
            title={text.videoTitle(videoInfo.title)}
            className="block font-normal"
          >
            {videoInfo.title}
          </span>
          <span title={text.authorTitle(videoInfo.author)}>
            {videoInfo.author}
          </span>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <Button
            asChild
            variant="outline"
            size={text.openBtn.label === "" ? "icon-sm" : "sm"}
            title={text.openBtn.title}
            type="button"
          >
            <a href={videoInfo.url} target="_blank">
              <span aria-hidden="true" className="flex gap-2 items-center">
                {text.openBtn.label !== "" && text.openBtn.label}
                <ExternalLink className="size-4" />
              </span>
            </a>
          </Button>
          <Button
            onClick={() => removeVideo(videoInfo.url)}
            size="icon-sm"
            variant="outline_destructive"
            title={text.removeBtn.title}
            type="button"
          >
            <span className="sr-only">{text.removeBtn.sr}</span>
            <Trash />
          </Button>
        </div>
      </div>
    </div>
  );
}
