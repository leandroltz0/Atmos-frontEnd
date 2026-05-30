export interface FavoriteCity {
  cityId: string;
  name: string;
  country: string;
  countryCode: string | null;
  region: string | null;
  lat: number;
  lon: number;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string | null;
}

export interface SearchHistoryEntry {
  cityId: string;
  label: string;
  name: string;
  country: string | null;
  countryCode: string | null;
  lat: number | null;
  lon: number | null;
  searchedAt: string | null;
}

export interface AddFavoriteRequest {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface ReorderFavoritesRequest {
  favoriteIds: string[];
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateNamePayload {
  name: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface UserPreferences {
  tempUnit: string;
  windUnit: string;
  language: string;
  timeFormat: string;
  updateInterval: number;
  pushNotifications: boolean;
  autoUpdate: boolean;
  offlineMode: boolean;
}
