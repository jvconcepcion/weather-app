import type { WMOCondition } from './wmo';

export const CONDITION_GRADIENTS: Record<WMOCondition, [string, string]> = {
  clear:  ['#f7971e', '#ffd200'],
  cloudy: ['#4b6cb7', '#182848'],
  rainy:  ['#373b44', '#4286f4'],
  snowy:  ['#c9d6df', '#e2ebf0'],
  stormy: ['#1a1a2e', '#16213e'],
  foggy:  ['#3d4e6b', '#6b7a8d'],
};

export const NIGHT_GRADIENT: [string, string] = ['#0f0c29', '#302b63'];
