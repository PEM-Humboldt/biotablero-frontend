/**
 * Metrics utils
 */
export class MetricsUtils {
  /**
   * Convert blob object to Base64 string
   * @param blob Blob data
   * @returns Base64 string
   */
  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
