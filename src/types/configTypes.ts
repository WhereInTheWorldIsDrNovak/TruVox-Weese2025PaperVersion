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
