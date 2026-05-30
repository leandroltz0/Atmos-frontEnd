import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { catchError, EMPTY } from 'rxjs';

import { APP_ROUTE_PATHS } from '../../core/routing/app-route-paths';
import { PreferencesService } from '../../core/services/preferences.service';
import { UserPreferences } from '../../core/models/favorite.model';

type ThemeMode = 'dark' | 'light';

type SettingsItem = {
  id: string;
  label: string;
  description: string;
} & (
  | { type: 'toggle'; value: boolean }
  | { type: 'select'; value: string; options: { value: string; label: string }[] }
  | { type: 'action'; actionLabel: string }
);

type SettingsGroup = {
  id: string;
  label: string;
  icon: string;
  items: SettingsItem[];
};

const THEME_STORAGE_KEY = 'atmos.theme';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPage implements OnInit {
  private readonly router = inject(Router);
  private readonly preferencesService = inject(PreferencesService);

  protected readonly themeMode = signal<ThemeMode>('dark');
  protected readonly isLoading = signal(true);
  protected readonly cachedCities = signal(5);
  protected readonly lastSyncLabel = signal('Hace 3 minutos');
  protected readonly appVersion = signal('1.0.0-beta');
  protected readonly groups = signal<SettingsGroup[]>([]);

  constructor() {
    this.restoreTheme();
  }

  ngOnInit(): void {
    this.preferencesService.get().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.buildGroups();
      },
      error: () => {
        this.isLoading.set(false);
        this.buildGroups();
      }
    });
  }

  protected onGoBack(): void {
    void this.router.navigate([`/${APP_ROUTE_PATHS.favorites}`]);
  }

  protected onToggleChanged(_groupId: string, itemId: string, checked: boolean): void {
    const patch: Partial<UserPreferences> = {};

    switch (itemId) {
      case 'push-notifications':
        patch.pushNotifications = checked;
        break;
      case 'auto-update':
        patch.autoUpdate = checked;
        break;
      case 'offline-mode':
        patch.offlineMode = checked;
        break;
    }

    if (Object.keys(patch).length > 0) {
      this.preferencesService.update(patch).pipe(
        catchError(() => EMPTY)
      ).subscribe(() => this.buildGroups());
    }
  }

  protected onSelectChanged(_groupId: string, itemId: string, value: string): void {
    const patch: Partial<UserPreferences> = {};

    switch (itemId) {
      case 'temp-unit':
        patch.tempUnit = value;
        break;
      case 'wind-unit':
        patch.windUnit = value;
        break;
      case 'language':
        patch.language = value;
        break;
      case 'time-format':
        patch.timeFormat = value;
        break;
      case 'update-interval':
        patch.updateInterval = Number(value);
        break;
    }

    if (Object.keys(patch).length > 0) {
      this.preferencesService.update(patch).pipe(
        catchError(() => EMPTY)
      ).subscribe(() => this.buildGroups());
    }
  }

  protected onActionTriggered(_groupId: string, itemId: string): void {
    switch (itemId) {
      case 'force-sync':
        this.lastSyncLabel.set('Ahora mismo');
        break;
      case 'clear-cache':
        this.cachedCities.set(0);
        break;
    }

    this.buildGroups();
  }

  protected trackByGroup(_index: number, group: SettingsGroup): string {
    return group.id;
  }

  protected trackByItem(_index: number, item: SettingsItem): string {
    return item.id;
  }

  protected isToggle(item: SettingsItem): item is SettingsItem & { type: 'toggle'; value: boolean } {
    return item.type === 'toggle';
  }

  protected isSelect(item: SettingsItem): item is SettingsItem & { type: 'select'; value: string; options: { value: string; label: string }[] } {
    return item.type === 'select';
  }

  protected isAction(item: SettingsItem): item is SettingsItem & { type: 'action'; actionLabel: string } {
    return item.type === 'action';
  }

  private buildGroups(): void {
    const prefs = this.preferencesService.preferences();

    this.groups.set([
      {
        id: 'units',
        label: 'Unidades',
        icon: 'ruler',
        items: [
          {
            id: 'temp-unit',
            type: 'select',
            label: 'Temperatura',
            description: 'Unidad de medida para temperatura',
            value: prefs.tempUnit,
            options: [
              { value: 'celsius', label: 'Celsius (°C)' },
              { value: 'fahrenheit', label: 'Fahrenheit (°F)' }
            ]
          },
          {
            id: 'wind-unit',
            type: 'select',
            label: 'Velocidad del viento',
            description: 'Unidad de medida para el viento',
            value: prefs.windUnit,
            options: [
              { value: 'kmh', label: 'km/h' },
              { value: 'mph', label: 'mph' },
              { value: 'ms', label: 'm/s' }
            ]
          },
          {
            id: 'time-format',
            type: 'select',
            label: 'Formato de hora',
            description: 'Formato para mostrar las horas',
            value: prefs.timeFormat,
            options: [
              { value: '24h', label: '24 horas' },
              { value: '12h', label: '12 horas' }
            ]
          }
        ]
      },
      {
        id: 'appearance',
        label: 'Apariencia',
        icon: 'palette',
        items: [
          {
            id: 'language',
            type: 'select',
            label: 'Idioma',
            description: 'Idioma de la interfaz',
            value: prefs.language,
            options: [
              { value: 'es', label: 'Español' },
              { value: 'en', label: 'English' }
            ]
          }
        ]
      },
      {
        id: 'notifications',
        label: 'Notificaciones',
        icon: 'bell',
        items: [
          {
            id: 'push-notifications',
            type: 'toggle',
            label: 'Notificaciones push',
            description: 'Recibir alertas meteorológicas en tu dispositivo',
            value: prefs.pushNotifications
          },
          {
            id: 'auto-update',
            type: 'toggle',
            label: 'Actualización automática',
            description: 'Refrescar datos del clima periódicamente',
            value: prefs.autoUpdate
          },
          {
            id: 'update-interval',
            type: 'select',
            label: 'Frecuencia de actualización',
            description: 'Intervalo entre cada actualización automática',
            value: String(prefs.updateInterval),
            options: [
              { value: '10', label: 'Cada 10 minutos' },
              { value: '30', label: 'Cada 30 minutos' },
              { value: '60', label: 'Cada 1 hora' }
            ]
          }
        ]
      },
      {
        id: 'data',
        label: 'Datos y sincronización',
        icon: 'cloud',
        items: [
          {
            id: 'offline-mode',
            type: 'toggle',
            label: 'Modo offline',
            description: `${this.cachedCities()} ciudades en caché local`,
            value: prefs.offlineMode
          },
          {
            id: 'force-sync',
            type: 'action',
            label: 'Forzar sincronización',
            description: `Última sincronización: ${this.lastSyncLabel()}`,
            actionLabel: 'Sincronizar'
          },
          {
            id: 'clear-cache',
            type: 'action',
            label: 'Limpiar caché',
            description: 'Eliminar todos los datos almacenados localmente',
            actionLabel: 'Limpiar'
          }
        ]
      }
    ]);
  }

  private restoreTheme(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        this.themeMode.set(stored);
      }
    } catch {
      // Ignore
    }
  }
}
