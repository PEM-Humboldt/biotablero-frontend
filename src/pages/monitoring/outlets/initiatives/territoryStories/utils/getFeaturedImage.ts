import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";

export function getRandomImageURL() {
  const seed = Math.floor(Math.random() * 100);
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

export function getFeaturedImage(territoryStory: TerritoryStoryShort): {
  url: string;
  alt: string;
} {
  if (!territoryStory.images || territoryStory.images.length === 0) {
    return { url: getRandomImageURL(), alt: "Imagen random" };
  }

  const images = territoryStory.images;
  const featuredImgInfo = images.find((img) => img.featuredContent);
  const randomImageInfo = images[Math.floor(Math.random() * images.length)];

  return {
    url: featuredImgInfo ? featuredImgInfo.fileUrl : randomImageInfo.fileUrl,
    alt: featuredImgInfo
      ? featuredImgInfo.description
      : randomImageInfo.description,
  };
}
