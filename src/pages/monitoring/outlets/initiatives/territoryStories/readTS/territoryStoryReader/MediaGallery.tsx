import { Camera, type LucideIcon, Play, Video } from "lucide-react";
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

type MediaTabConfig = {
  value: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
};

export function MediaGallery({ story }: { story: TerritoryStoryFull }) {
  const hasImages = story.images && story.images.length > 0;
  const hasVideos = story.videos && story.videos.length > 0;

  const tabsConfig = [
    hasImages && {
      value: "images",
      label: "Galería de imágenes",
      icon: Camera,
      content: <ImageGallery images={story.images} />,
    },
    hasVideos && {
      value: "videos",
      label: "Galería de videos",
      icon: Video,
      content: <VideoGallery videos={story.videos} />,
    },
  ].filter(Boolean) as MediaTabConfig[];

  if (tabsConfig.length === 0) {
    return null;
  }

  return (
    <Tabs
      defaultValue={tabsConfig[0].value}
      className="mx-4 lg:mx-8 rounded-lg! overflow-hidden"
    >
      <TabsList className="w-full h-auto flex *:flex-1 p-0! m-0!">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="group text-lg border-b-2 border-b-primary data-[state=active]:border-b-accent data-[state=active]:bg-background data-[state=active]:text-primary data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-background text-primary justify-start p-0 cursor-pointer data-[state=active]:cursor-auto"
            >
              <Icon
                className="p-2 mr-2 size-9 group-data-[state=active]:text-accent-foreground group-data-[state=active]:bg-accent"
                aria-hidden="true"
              />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabsConfig.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="m-0 p-0 bg-background"
        >
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {images.map((image, index) => (
          <DialogTrigger asChild key={image.fileUrl}>
            <button
              onClick={() => setSelectedIndex(index)}
              type="button"
              className="rounded overflow-hidden outline outline-primary/50 hover:outline-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
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

      <DialogContent className="max-w-5xl w-[90%] max-h-[80vh] bg-background">
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
                <div className="flex flex-col h-full items-center justify-center">
                  <div className="relative flex-1 w-full min-h-0 flex items-center justify-center">
                    <img
                      src={image.fileUrl}
                      alt={image.description}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {image.description && (
                    <p className="py-4 text-lg w-full text-center shrink-0">
                      {image.description}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div>
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
    <div className="p-8 text-3xl text-primary text-center">
      Cargando la información de los videos...
    </div>
  ) : (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/20 border border-accent rounded-b-lg p-4"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {videosInfo.map((video) => (
          <figure
            key={video.url}
            className="group relative rounded overflow-hidden outline outline-primary/50 hover:outline-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
            title="Abrir en Youtube"
          >
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300">
                <Play
                  className="text-background bg-primary/90 p-2 rounded-full size-12 group-hover:bg-accent transition-colors duration-300"
                  strokeWidth={1}
                />
              </div>

              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full"
              />

              <figcaption className="absolute bottom-0 bg-background/90 w-full px-3 py-2 text-base truncate">
                {video.title}
              </figcaption>
            </a>
          </figure>
        ))}
      </div>
    </>
  );
}

// NOTE: El componente es totalmente funcional, pero en ningún momento
// pedimos consentimiento para la telemetría de google, caí en cuenta al
// terminarlo y ver la consola inundada de peticiones de YT que bloqueó mi compu
export function VideoGalleryYTTelemetry({
  videos,
}: {
  videos: Omit<VideoObjectTS, "territoryStoryId">[];
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [videosInfo, setVideosInfo] = useState<YoutubeVideoMetadata[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      <Dialog>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {videosInfo.map((video, index) => (
            <DialogTrigger asChild key={video.url}>
              <button
                onClick={() => setSelectedIndex(index)}
                className="group relative rounded overflow-hidden outline outline-primary/50 hover:outline-primary transition-all duration-300"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="aspect-video object-cover w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/0 group-hover:bg-primary/50 transition-colors cursor-pointer">
                  <Play className="text-background size-10" strokeWidth={1} />
                </div>
                <figcaption className="absolute bottom-0 bg-background/90 w-full px-2 py-1 text-sm truncate">
                  {video.title}
                </figcaption>
              </button>
            </DialogTrigger>
          ))}
        </div>

        <DialogContent className="max-w-5xl w-[90%] max-h-[85vh] bg-background p-6">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary font-normal truncate">
              {videosInfo[selectedIndex]?.title || "Reproductor de Video"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Reproductor de videos de YouTube
            </DialogDescription>
          </DialogHeader>

          <Carousel
            key={`video-carousel-${selectedIndex}`}
            opts={{ startIndex: selectedIndex }}
            className="w-full"
          >
            <CarouselContent>
              {videosInfo.map((video, index) => (
                <CarouselItem key={`embed-${index}`}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      className="w-full aspect-video h-full border-0"
                    />

                    <p className="pt-4 text-lg w-full text-center shrink-0">
                      {video.title}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div>
              <CarouselPrevious className="rounded-lg -left-16" />
              <CarouselNext className="rounded-lg -right-16" />
            </div>
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
