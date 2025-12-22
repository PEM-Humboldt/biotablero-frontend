type ValidatorResponse = [sanitized: string, errors: string[]];

/**
 * String validation and sanitization utility.
 * Chain methods as needed and access `.result` for the final output.
 *
 * * @remarks
 * If `customAsync` is used in the chain, the entire execution becomes asynchronous and the final result must be awaited.
 */
export class StrValidator {
  private readonly originalStr: string;
  private strToValidate: string;
  private errors: string[];
  private optional: boolean;

  /**
   * @param str - Initial string to validate.
   */
  constructor(str: string | number) {
    this.strToValidate = String(str);
    this.errors = [];
    this.optional = false;
    this.originalStr = String(str);
  }

  /**
   * Removes string accents and special characters for comparisons
   *
   * @param str - The string to normalize.
   */
  static normalize(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .toLowerCase();
  }

  /**
   * Static sanitization: trims, removes control chars, and escapes HTML.
   * 1. Removes custom characters if provided.
   * 2. Trims whitespace and removes non-printable control characters.
   * 3. Collapses multiple spaces into one.
   * 4. Escapes HTML entities.
   *
   * @param str - The raw input string.
   * @param removeExtraChars - Characters to be stripped from the string.
   * @returns The sanitized string.
   */
  static sanitize(str: string, removeExtraChars?: string): string {
    let cleanString = str;

    if (removeExtraChars) {
      const cleanedExtraChars = removeExtraChars.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        "\\$&",
      );
      const charsRegex = new RegExp(`[${cleanedExtraChars}]`, "g");
      cleanString = cleanString.replace(charsRegex, "");
    }

    return (
      cleanString
        .trim()
        // NOTE: Se desactiva para permitir la limpieza de caracteres escapados
        // eslint-disable-next-line no-control-regex
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .replace(/ +/g, " ")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
    );
  }

  /**
   * Sanitizes the current instance string.
   *
   * @param removeExtraChars - Characters to be stripped from the string.
   */
  sanitize(removeExtraChars?: string): this {
    this.strToValidate = StrValidator.sanitize(
      this.strToValidate,
      removeExtraChars,
    );

    return this;
  }

  /**
   * Marks the field as optional. If the string is empty, the `result` getter
   * will return no errors regardless of other validation checks.
   */
  isOptional(): this {
    if (this.originalStr === "") {
      this.optional = true;
    }
    return this;
  }

  /**
   * Validates that the instance string is not empty.
   */
  isRequired(): this {
    if (this.strToValidate === "") {
      this.errors.push("Este campo es obligatorio");
    }
    return this;
  }

  /**
   * Validates if the instance string length is at least the specified minimum.
   *
   * @param strLength - Minimum character count required.
   */
  hasLengthMoreThan(strLength: number): this {
    if (this.strToValidate.length < strLength) {
      this.errors.push(
        `Este campo debe tener al menos ${strLength} caracteres.`,
      );
    }
    return this;
  }

  /**
   * Validates if the instance string length does not exceed the specified maximum.
   *
   * @param strLength - Maximum character count allowed.
   */
  hasLengthLessOrEqualThan(strLength: number): this {
    if (this.strToValidate.length > strLength) {
      this.errors.push(`Este campo debe tener máximo ${strLength} caracteres.`);
    }
    return this;
  }

  /**
   * Compares if the instance string already exist in a normalized set of strings
   *
   * @param valuesSet - Set of existing strings to compare against.
   */
  isUniqueIn(valuesSet: Set<string>): this {
    for (const value of valuesSet) {
      if (
        StrValidator.normalize(value) ===
        StrValidator.normalize(this.strToValidate)
      ) {
        this.errors.push("Este valor ya existe.");
        break;
      }
    }
    return this;
  }

  /**
   * Checks if the instance string is a valid Colombian phone number (Mobile or Ground).
   */
  isColombianPhone(): this {
    const phoneRegex = /^(3[0-9]{9}|60[0-9]{8})$/;
    if (!phoneRegex.test(this.strToValidate)) {
      this.errors.push("Ingresa un número de teléfono válido.");
    }
    return this;
  }

  /**
   * Validates the instance string against a standard gmail email regex.
   */
  isEmail(): this {
    const emailRegex =
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i;
    if (!emailRegex.test(this.strToValidate)) {
      this.errors.push("Ingresa un correo electrónico válido.");
    }
    return this;
  }

  /**
   * Validates if the instance string is a propper URL string.
   */
  isURL(): this {
    try {
      new URL(this.strToValidate);
    } catch {
      this.errors.push("Ingresa una URL válida.");
    }
    return this;
  }

  /**
   * Runs a custom synchronous validation on the instance string.
   *
   * @param validatorCallback - Function that returns true if valid.
   * @param errorStr - Message to push if validation fails.
   */
  custom(validatorCallback: (str: string) => boolean, errorStr: string): this {
    if (!validatorCallback(this.strToValidate)) {
      this.errors.push(errorStr);
    }
    return this;
  }

  /**
   * Runs a custom asynchronous validation on the instance string.
   *
   * * @remarks
   * If this method is used, the entire chain becomes asynchronous and must be awaited.
   *
   * @param validatorCallback - Async function that returns true if valid.
   * @param errorStr - Message to push if validation fails or throws.
   */
  async customAsync(
    validatorCallback: (str: string) => Promise<boolean>,
    errorStr: string,
  ): Promise<this> {
    try {
      const isValid = await validatorCallback(this.strToValidate);
      if (!isValid) {
        this.errors.push(errorStr);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.errors.push(`${errorStr}: ${message}`);
    }

    return this;
  }

  /**
   * Gets the final sanitized string and error collection.
   */
  get result(): ValidatorResponse {
    if (this.optional && this.originalStr === "") {
      return [this.strToValidate, []];
    }
    return [this.strToValidate, this.errors];
  }
}
