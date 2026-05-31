import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  computed,
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
import { finalize } from 'rxjs';

import { APP_ROUTE_PATHS } from '../../core/routing/app-route-paths';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { PublicUser } from '../../core/models/favorite.model';
import { ProfileStat, ProfileAction } from './profile.types';

import { ProfileBackgroundComponent } from '../../components/profile/background/background.component';
import { ProfileHeaderComponent } from '../../components/profile/header/header.component';
import { ProfileHeroSectionComponent } from '../../components/profile/hero-section/hero-section.component';
import { ProfileStatsGridComponent } from '../../components/profile/stats-grid/stats-grid.component';
import { ProfileActionGroupComponent } from '../../components/profile/action-group/action-group.component';
import { ProfileFooterComponent } from '../../components/profile/footer/footer.component';

const INITIAL_STATS: ProfileStat[] = [
  { id: 'favorites', label: 'Favoritas', value: 0, icon: 'heart', tone: 'accent' },
  { id: 'days', label: 'Días activo', value: 0, icon: 'activity', tone: 'sun' }
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
    MatSnackBarModule,
    ProfileBackgroundComponent,
    ProfileHeaderComponent,
    ProfileHeroSectionComponent,
    ProfileStatsGridComponent,
    ProfileActionGroupComponent,
    ProfileFooterComponent
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage implements OnInit {
  @ViewChild('logoutDialog') logoutDialogRef!: TemplateRef<unknown>;
  @ViewChild('deleteDialog') deleteDialogRef!: TemplateRef<unknown>;
  @ViewChild('changePasswordDialog') changePasswordDialogRef!: TemplateRef<unknown>;

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly favoritesService = inject(FavoritesService);

  protected readonly user = signal<Pick<PublicUser, 'name' | 'email'> & { memberSince: string }>({
    name: '',
    email: '',
    memberSince: ''
  });
  protected readonly initials = computed(() => {
    const name = this.user().name;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });
  protected readonly stats = signal<ProfileStat[]>([...INITIAL_STATS]);
  protected readonly isEditingName = signal(false);
  protected readonly editNameValue = signal('');
  protected readonly isSavingName = signal(false);
  protected readonly appVersion = signal('1.0.0-beta');

  // Change password dialog
  protected readonly cpCurrent = signal('');
  protected readonly cpNew = signal('');
  protected readonly cpConfirm = signal('');
  protected readonly isChangingPassword = signal(false);
  protected readonly cpError = signal('');

  // Delete account dialog
  protected readonly deletePassword = signal('');
  protected readonly isDeleting = signal(false);
  protected readonly deleteError = signal('');

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
    this.loadProfile();
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
    this.editNameValue.set(this.user().name);
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

    this.isSavingName.set(true);
    this.userService.updateName(trimmed).pipe(finalize(() => this.isSavingName.set(false))).subscribe({
      next: () => {
        this.user.update((u) => ({ ...u, name: trimmed }));
        this.isEditingName.set(false);
        this.snackBar.open('Nombre actualizado', 'OK', {
          duration: 2500,
          panelClass: 'atmos-snackbar'
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.authService.logout();
          return;
        }
        this.snackBar.open(err.error?.error || 'Error al actualizar nombre', 'OK', {
          duration: 3000,
          panelClass: 'atmos-snackbar--warn'
        });
      }
    });
  }

  protected onCancelEditName(): void {
    this.isEditingName.set(false);
  }

  protected onEditNameChange(value: string): void {
    this.editNameValue.set(value);
  }

  protected onActionTriggered(actionId: string): void {
    switch (actionId) {
      case 'edit-name':
        this.onStartEditName();
        break;
      case 'change-password':
        this.openChangePasswordDialog();
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
    this.authService.logout();
  }

  protected onSavePassword(): void {
    const current = this.cpCurrent().trim();
    const newPw = this.cpNew().trim();
    const confirm = this.cpConfirm().trim();
    const errors: string[] = [];

    if (!current) errors.push('La contraseña actual es obligatoria');
    if (newPw.length < 6) errors.push('La nueva contraseña debe tener al menos 6 caracteres');
    if (newPw !== confirm) errors.push('Las contraseñas nuevas no coinciden');

    if (errors.length) {
      this.cpError.set(errors.join('. '));
      return;
    }

    this.cpError.set('');
    this.isChangingPassword.set(true);
    this.userService.changePassword(current, newPw).pipe(finalize(() => this.isChangingPassword.set(false))).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.cpCurrent.set('');
        this.cpNew.set('');
        this.cpConfirm.set('');
        this.snackBar.open('Contraseña actualizada correctamente', 'OK', {
          duration: 3000,
          panelClass: 'atmos-snackbar'
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          if (err.error?.error === 'Current password is incorrect') {
            this.cpError.set('La contraseña actual es incorrecta');
          } else {
            this.authService.logout();
          }
          return;
        }
        this.cpError.set(err.error?.error || 'Error al cambiar contraseña');
      }
    });
  }

  protected onCancelPassword(): void {
    this.dialog.closeAll();
    this.cpCurrent.set('');
    this.cpNew.set('');
    this.cpConfirm.set('');
    this.cpError.set('');
  }

  protected onConfirmDelete(): void {
    const password = this.deletePassword().trim();
    if (!password) {
      this.deleteError.set('Ingresá tu contraseña para confirmar');
      return;
    }

    this.deleteError.set('');
    this.isDeleting.set(true);
    this.userService.deleteAccount(password).pipe(finalize(() => this.isDeleting.set(false))).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.snackBar.open('Cuenta eliminada. Hasta pronto.', '', {
          duration: 3000,
          panelClass: 'atmos-snackbar--warn'
        });
        this.authService.logout();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          if (err.error?.error === 'Password is incorrect') {
            this.deleteError.set('La contraseña es incorrecta');
          } else {
            this.authService.logout();
          }
          return;
        }
        this.deleteError.set(err.error?.error || 'Error al eliminar cuenta');
      }
    });
  }

  protected onDismissDialog(): void {
    this.dialog.closeAll();
    this.deletePassword.set('');
    this.deleteError.set('');
  }

  private openLogoutDialog(): void {
    this.dialog.open(this.logoutDialogRef, {
      width: '360px',
      panelClass: 'atmos-dialog',
      autoFocus: false
    });
  }

  private openDeleteDialog(): void {
    this.deletePassword.set('');
    this.deleteError.set('');
    this.dialog.open(this.deleteDialogRef, {
      width: '360px',
      panelClass: 'atmos-dialog',
      autoFocus: false
    });
  }

  private openChangePasswordDialog(): void {
    this.cpCurrent.set('');
    this.cpNew.set('');
    this.cpConfirm.set('');
    this.cpError.set('');
    this.dialog.open(this.changePasswordDialogRef, {
      width: '400px',
      panelClass: 'atmos-dialog',
      autoFocus: false
    });
  }

  private loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res: unknown) => {
        const data = res as { user?: PublicUser };
        const u = data.user || (res as PublicUser);
        if (u?.name) {
          this.user.set({
            name: u.name,
            email: u.email,
            memberSince: u.created_at
              ? new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date(u.created_at))
              : ''
          });

          if (u.created_at) {
            const days = this.calculateDaysSince(u.created_at);
            this.stats.update((s) =>
              s.map((stat) => (stat.id === 'days' ? { ...stat, value: days } : stat))
            );
          }
        }
      }
    });

    this.favoritesService.getAll().subscribe({
      next: (list) => {
        this.stats.update((s) =>
          s.map((stat) => (stat.id === 'favorites' ? { ...stat, value: list.length } : stat))
        );
      }
    });
  }

  private calculateDaysSince(dateStr: string): number {
    const created = new Date(dateStr);
    const now = new Date();
    return Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
  }
}
