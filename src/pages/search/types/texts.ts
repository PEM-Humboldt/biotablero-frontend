export interface textsObject {
  info: string;
  meto: string;
  cons: string;
  quote: string;
}

export interface helperText {
  helper: string;
}

export type textResponse = textsObject | helperText;
