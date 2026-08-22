const imageModules = import.meta.glob<{ default: string }>(
  "/src/core/assets/randomImagesBank/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
);

export const imagesBank: { url: string; alt: string }[] = Object.values(
  imageModules,
).map((img) => ({
  url: img.default,
  alt: "Imagen aleatoria",
}));
