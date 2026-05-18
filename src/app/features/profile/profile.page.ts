import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { APP_ROUTE_PATHS } from '../../core/routing/app-route-paths';

type UserProfile = {
  displayName: string;
  email: string;
  avatarUrl: string | null;
  authProvider: 'email' | 'google';
  memberSince: string;
};

type ProfileStat = {
  id: string;
  label: string;
  value: number;
  icon: string;
  tone: 'accent' | 'info' | 'sun';
};

type ProfileAction = {
  id: string;
  label: string;
  description: string;
  icon: string;
  tone: 'default' | 'danger';
};

const STORAGE_KEY = 'atmos.profile';

const MOCK_USER: UserProfile = {
  displayName: 'Leandro García',
  email: 'leandro.garcia@email.com',
  avatarUrl: null,
  authProvider: 'email',
  memberSince: 'Enero 2026'
};

const MOCK_STATS: ProfileStat[] = [
  { id: 'favorites', label: 'Favoritas', value: 5, icon: 'heart', tone: 'accent' },
  { id: 'alerts', label: 'Alertas', value: 3, icon: 'bell', tone: 'info' },
  { id: 'days', label: 'Días activo', value: 42, icon: 'activity', tone: 'sun' }
];

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage implements OnInit {
  @ViewChild('logoutDialog') logoutDialogRef!: TemplateRef<unknown>;
  @ViewChild('deleteDialog') deleteDialogRef!: TemplateRef<unknown>;

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);


  protected readonly user = signal<UserProfile>({ ...MOCK_USER });
  protected readonly stats = signal<ProfileStat[]>([...MOCK_STATS]);
  protected readonly isEditingName = signal(false);
  protected readonly editNameValue = signal('');
  protected readonly appVersion = signal('1.0.0-beta');

  protected readonly accountActions: ProfileAction[] = [
    {
      id: 'edit-name',
      label: 'Nombre de usuario',
      description: 'Cambiar tu nombre visible',
      icon: 'edit',
      tone: 'default'
    },
    {
      id: 'change-password',
      label: 'Cambiar contraseña',
      description: 'Actualizar tu contraseña actual',
      icon: 'lock',
      tone: 'default'
    }
  ];

  protected readonly sessionActions: ProfileAction[] = [
    {
      id: 'logout',
      label: 'Cerrar sesión',
      description: 'Salir de tu cuenta en este dispositivo',
      icon: 'logout',
      tone: 'default'
    },
    {
      id: 'delete-account',
      label: 'Eliminar cuenta',
      description: 'Esta acción es permanente e irreversible',
      icon: 'delete_forever',
      tone: 'danger'
    }
  ];

  ngOnInit(): void {
    this.restoreProfile();
  }

  protected getUserInitials(): string {
    const name = this.user().displayName;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  protected getProviderLabel(): string {
    return this.user().authProvider === 'google' ? 'Google' : 'Email';
  }

  protected onGoBack(): void {
    void this.router.navigate([`/${APP_ROUTE_PATHS.settings}`]);
  }

  protected onAvatarClick(): void {
    this.snackBar.open('Cambio de avatar próximamente', 'OK', {
      duration: 3000,
      panelClass: 'atmos-snackbar'
    });
  }

  protected onStartEditName(): void {
    this.editNameValue.set(this.user().displayName);
    this.isEditingName.set(true);
  }

  protected onSaveName(): void {
    const trimmed = this.editNameValue().trim();
    if (trimmed.length < 2) {
      this.snackBar.open('El nombre debe tener al menos 2 caracteres', 'OK', {
        duration: 3000,
        panelClass: 'atmos-snackbar--warn'
      });
      return;
    }

    this.user.update((u) => ({ ...u, displayName: trimmed }));
    this.isEditingName.set(false);
    this.persistProfile();
    this.snackBar.open('Nombre actualizado', 'OK', {
      duration: 2500,
      panelClass: 'atmos-snackbar'
    });
  }

  protected onCancelEditName(): void {
    this.isEditingName.set(false);
  }

  protected onActionTriggered(actionId: string): void {
    switch (actionId) {
      case 'edit-name':
        this.onStartEditName();
        break;
      case 'change-password':
        this.snackBar.open('Recuperación de contraseña próximamente', 'OK', {
          duration: 3000,
          panelClass: 'atmos-snackbar'
        });
        break;
      case 'logout':
        this.openLogoutDialog();
        break;
      case 'delete-account':
        this.openDeleteDialog();
        break;
    }
  }

  protected onConfirmLogout(): void {
    this.dialog.closeAll();
    this.snackBar.open('Sesión cerrada', 'OK', {
      duration: 2500,
      panelClass: 'atmos-snackbar'
    });
    // Mock: navigate to onboarding
    void this.router.navigate([`/${APP_ROUTE_PATHS.onboarding}`]);
  }

  protected onConfirmDelete(): void {
    this.dialog.closeAll();
    this.snackBar.open('Cuenta eliminada. Hasta pronto.', '', {
      duration: 3000,
      panelClass: 'atmos-snackbar--warn'
    });
    // Mock: navigate to onboarding
    void this.router.navigate([`/${APP_ROUTE_PATHS.onboarding}`]);
  }

  protected onDismissDialog(): void {
    this.dialog.closeAll();
  }

  protected trackByStat(_index: number, stat: ProfileStat): string {
    return stat.id;
  }

  protected trackByAction(_index: number, action: ProfileAction): string {
    return action.id;
  }

  private openLogoutDialog(): void {
    this.dialog.open(this.logoutDialogRef, {
      width: '360px',
      panelClass: 'atmos-dialog',
      autoFocus: false
    });
  }

  private openDeleteDialog(): void {
    this.dialog.open(this.deleteDialogRef, {
      width: '360px',
      panelClass: 'atmos-dialog',
      autoFocus: false
    });
  }

  private persistProfile(): void {
    if (typeof window === 'undefined') return;
    const data = { displayName: this.user().displayName };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private restoreProfile(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.displayName) {
        this.user.update((u) => ({ ...u, displayName: data.displayName }));
      }
    } catch {
      // Ignore malformed storage
    }
  }
}
