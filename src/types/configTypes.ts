export interface CONFIG {
  SRATE: number;
  fxmin: number;
  fxlow: number;
  fxhigh: number;
  fxmax: number;
}

export interface COLORS {
  textColor: string;
  dashedLineColor: string;
  realVoiceColor: string;
  targetVoiceColor: string;
  closeVoiceColor: string;
  currentVoiceColor: string;
}

export interface ThemeColors {
  [key: string]: {
    default: COLORS;
    co: COLORS;
    [key: string]: COLORS;
  };
}

export interface Validation {
  type:
    | 'regex_match'
    | 'regex_test'
    | 'string_includes'
    | 'string_match'
    | 'length';
  argument: RegExp | string[] | string | number;
  errMessage: string;
  tooltipDesc?: string | undefined;
}
