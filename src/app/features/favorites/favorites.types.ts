export type SyncState = 'local' | 'synced' | 'pending';

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  temp: number;
  feelsLike: number;
  min: number;
  max: number;
  condition: string;
  conditionLabel: string;
  icon: string;
  precipChance: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  updatedMinutesAgo: number;
  syncState: SyncState;
  accent: string;
}

export interface FavoriteMetric {
  label: string;
  value: string;
  helper: string;
  tone: 'accent' | 'info' | 'sun' | 'success';
}
