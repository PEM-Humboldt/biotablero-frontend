import { Camera, type LucideIcon, Video } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ui/shadCN/component/tabs";
import type {
  ImageObjectTS,
  TerritoryStoryFull,
  VideoObjectTS,
} from "pages/monitoring/types/territoryStory";
import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import {
  getCleanYoutubeId,
  getYoutubeVideoMetadata,
  type YoutubeVideoMetadata,
} from "pages/monitoring/api/services/youtube";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { ErrorsList } from "@ui/LabelingWithErrors";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@ui/shadCN/component/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/shadCN/component/carousel";
import { Button } from "@ui/shadCN/component/button";

type MediaTabConfig = {
  value: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
};

export function MediaGallery({
  story,
}: {
  story: TerritoryStoryFull | TerritoryStoryShort;
}) {
  const hasImages = story.images && story.images.length > 0;
  const hasVideos = story.videos && story.videos.length > 0;

  const tabsConfig = [
    hasImages && {
      value: "images",
      label: "Galería de imágenes",
      icon: Camera,
      content: <ImageGallery images={story.images!} />,
    },
    hasVideos && {
      value: "videos",
      label: "Galería de videos",
      icon: Video,
      content: <VideoGallery videos={story.videos!} />,
    },
  ].filter(Boolean) as MediaTabConfig[];

  if (tabsConfig.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue={tabsConfig[0].value}>
      <TabsList className="w-full h-auto flex *:flex-1 bg-accent p-0! m-0!">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-lg border-b-2 border-b-primary data-[state=active]:border-b-accent data-[state=active]:bg-primary data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-background bg-grey-light text-primary data-[state=active]:text-background justify-start p-0 cursor-pointer data-[state=active]:cursor-auto"
            >
              <Icon
                className="bg-primary/20 p-2 mr-2 size-9"
                aria-hidden="true"
              />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabsConfig.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="m-0 p-0">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ImageGallery({ images }: { images: ImageObjectTS[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <Dialog>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <DialogTrigger asChild key={image.fileUrl}>
            <button
              onClick={() => setSelectedIndex(index)}
              type="button"
              className=""
            >
              <img
                src={image.fileUrl}
                alt={image.description}
                className="aspect-video object-cover w-full"
              />
            </button>
          </DialogTrigger>
        ))}
      </div>

      <DialogContent className="max-w-5xl w-[90%] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary font-normal">
            Galería de imágenes
          </DialogTitle>
          <DialogDescription className="sr-only">
            Visualizador de fotos y videos del relato actual. Usa las flechas
            para navegar entre el contenido.
          </DialogDescription>
        </DialogHeader>

        <Carousel
          key={`carousel-at-${selectedIndex}`}
          opts={{ startIndex: selectedIndex }}
        >
          <CarouselContent className="">
            {images.map((image, index) => (
              <CarouselItem key={`full-${index}`}>
                <div className="flex flex-col ">
                  <img
                    src={image.fileUrl}
                    alt={image.description}
                    className="rounded w-auto object-contain"
                  />
                  {image.description && (
                    <p className="p-4 text-lg">{image.description}</p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="">
            <CarouselPrevious className="rounded-lg -left-16" />
            <CarouselNext className="rounded-lg -right-16" />
          </div>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}

function VideoGallery({
  videos,
}: {
  videos: Omit<VideoObjectTS, "territoryStoryId">[];
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [videosInfo, setVideosInfo] = useState<YoutubeVideoMetadata[]>([]);

  const fetchAllVideos = useCallback(async () => {
    setIsLoading(true);

    const requests = videos.map(async (video) => {
      const id = getCleanYoutubeId(video.fileUrl ?? "");
      const res = await getYoutubeVideoMetadata(id);

      if (isMonitoringAPIError(res)) {
        setErrors((prev) => [...prev, ...res.data.map((e) => e.msg)]);
        return null;
      }
      return res;
    });

    const results = await Promise.all(requests);

    const validData = results.filter(
      (item): item is YoutubeVideoMetadata => item !== null,
    );

    setVideosInfo(validData);
    setIsLoading(false);
  }, [videos]);

  useEffect(() => {
    void fetchAllVideos();
  }, [fetchAllVideos]);

  return isLoading ? (
    <div>Cargando videos...</div>
  ) : (
    <>
      <ErrorsList errorItems={errors} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {videosInfo.map((video) => (
          <figure>
            <img
              key={video.url}
              src={video.thumbnail}
              alt=""
              className="aspect-video object-cover"
            />
            <figcaption>{video.title}</figcaption>
            <Button asChild>
              <a href={video.url} target="_blank">
                Abrir en youtube
              </a>
            </Button>
          </figure>
        ))}
      </div>
    </>
  );
}
