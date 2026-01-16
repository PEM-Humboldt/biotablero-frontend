import type { ImageMimeType } from "@appTypes/formats";
import { Dispatch, SetStateAction } from "react";

export type ImgValidatorResponse = [file: File | null, errors: string[]];

/**
 * Image file validation utility.
 * Chain methods to validate file metadata and image properties.
 *
 * * @remarks
 * If `validateDimensions` is used in the chain, the execution becomes asynchronous and the final result must be awaited.
 * It is recommended to provide a `submitBlocker` to prevent race conditions between the validation process and the form submission when using asynchronous methods.
 */
export class ImgValidator {
  private imgFile: File | null;
  private errors: string[] = [];
  private submitBlocker?:
    | Dispatch<SetStateAction<boolean>>
    | ((block: boolean) => void);

  /**
   * @param imgFile - Initial File object to validate.
   * @param submitBlocker - Optional state setter to manage UI blocking during async operations.
   */
  constructor(
    imgFile: File | null,
    submitBlocker?:
      | Dispatch<SetStateAction<boolean>>
      | ((block: boolean) => void),
  ) {
    this.imgFile = imgFile || null;
    this.submitBlocker = submitBlocker;
  }

  /**
   * Validates that the file is present and not null.
   */
  isRequired() {
    if (!this.imgFile) {
      this.errors.push("Es obligatorio cargar esta imagen");
    }
    return this;
  }

  /**
   * Validates if the file MIME type is included in the allowed types array.
   *
   * @param allowedTypes - Array of permitted `ImageMimeType` values.
   */
  isFormat(allowedTypes: ImageMimeType[]) {
    if (
      this.imgFile &&
      !allowedTypes.includes(this.imgFile.type as ImageMimeType)
    ) {
      this.errors.push(
        `Formato no válido, formatos permitidos: ${allowedTypes.join(", ")}.`,
      );
    }
    return this;
  }

  /**
   * Validates if the file size does not exceed the specified limit in Megabytes.
   *
   * @param mb - Maximum file size allowed in MB.
   */
  maxSize(mb: number) {
    if (this.imgFile && this.imgFile.size > mb * 1024 * 1024) {
      const actualMB = (this.imgFile.size / (1024 * 1024)).toFixed(2);

      this.errors.push(
        `El archivo supera los ${mb}MB, tamaño actual: ${actualMB}MB.`,
      );
    }
    return this;
  }

  /**
   * Asynchronously validates image dimensions and aspect ratio.
   * It Triggers `submitBlocker(true)` before execution.
   *
   * @param constraints - Object containing dimension limits and aspect ratio units.
   * @param constraints.minWidth - Minimum width required in pixels.
   * @param constraints.minHeight - Minimum height required in pixels.
   * @param constraints.maxWidth - Maximum width allowed in pixels.
   * @param constraints.maxHeight - Maximum height allowed in pixels.
   *
   * @param constraints.aspectRatio - Expected relationship between width and height.
   * @param constraints.aspectRatio.widthUnit - Horizontal part of the ratio
   * @param constraints.aspectRatio.heightUnit - Vertical part of the ratio
   */
  async validateDimensions(constraints: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: { widthUnit: number; heightUnit: number };
  }) {
    if (!this.imgFile || !this.imgFile.type.startsWith("image/")) {
      return this;
    }

    if (this.submitBlocker) {
      this.submitBlocker(true);
    }

    return new Promise<ImgValidator>((resolve) => {
      try {
        const img = new Image();
        img.src = URL.createObjectURL(this.imgFile!);

        img.onload = () => {
          URL.revokeObjectURL(img.src);
          const { width, height } = img;

          if (constraints.minWidth && width < constraints.minWidth) {
            this.errors.push(
              `Ancho menor al mínimo ${constraints.minWidth}px, ancho actual: ${width}px.`,
            );
          }

          if (constraints.minHeight && height < constraints.minHeight) {
            this.errors.push(
              `Alto menor al mínimo ${constraints.minHeight}px, alto actual: ${height}px.`,
            );
          }

          if (constraints.maxWidth && width > constraints.maxWidth) {
            this.errors.push(
              `Ancho superior al máximo ${constraints.maxWidth}px, ancho actual: ${width}px.`,
            );
          }

          if (constraints.maxHeight && height > constraints.maxHeight) {
            this.errors.push(
              `Alto superior al máximo ${constraints.maxHeight}px, alto actual: ${height}px.`,
            );
          }

          if (constraints.aspectRatio) {
            const currentRatio = width / height;
            const desiredRatio =
              constraints.aspectRatio.widthUnit /
              constraints.aspectRatio.heightUnit;

            if (Math.abs(currentRatio - desiredRatio) > 0.01) {
              this.errors.push(
                `La relación de aspecto es incorrecta, relación esperada ${constraints.aspectRatio.widthUnit}:${constraints.aspectRatio.heightUnit}.`,
              );
            }
          }
          resolve(this);
        };

        img.onerror = () => {
          this.errors.push("No se pudo leer la imagen");
          resolve(this);
        };
      } catch {
        this.errors.push("Error inesperado al procesar la imagen.");
        resolve(this);
      }
    });
  }

  /**
   * Gets the original file and the collection of validation errors and triggers `submitBlocker(false)`.
   */
  get result(): ImgValidatorResponse {
    if (this.submitBlocker) {
      this.submitBlocker(false);
    }

    return [this.imgFile, this.errors];
  }
}
