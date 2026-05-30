import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { finalize } from 'rxjs';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

import { APP_ROUTE_PATHS } from '../../core/routing/app-route-paths';
import { AuthService, LoginResponse } from '../../core/services/auth.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { AuthBackgroundComponent } from '../../components/auth/auth-background/auth-background.component';
import { AuthTopbarComponent } from '../../components/auth/auth-topbar/auth-topbar.component';
import { AuthFormPanelComponent } from '../../components/auth/auth-form-panel/auth-form-panel.component';
import { AuthPreviewPanelComponent } from './components/auth-preview-panel/auth-preview-panel.component';

const passwordMatchValidator = (control: { get: (key: string) => { value: unknown } | null }): Record<string, boolean> | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};

type AuthMode = 'signin' | 'signup';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    AuthBackgroundComponent,
    AuthTopbarComponent,
    AuthFormPanelComponent,
    AuthPreviewPanelComponent
  ],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPage implements AfterViewInit {
  @ViewChild('shell', { static: true }) private readonly shellRef!: ElementRef<HTMLElement>;

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly preferencesService = inject(PreferencesService);

  protected readonly mode = signal<AuthMode>('signup');
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly signInForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true]
  });

  protected readonly signUpForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    termsAccepted: [false, [Validators.requiredTrue]]
  }, { validators: passwordMatchValidator });

  ngAfterViewInit(): void {
    const root = this.shellRef.nativeElement;

    gsap.set(root.querySelectorAll('.auth-reveal'), {
      opacity: 0,
      y: 24
    });

    gsap.to(root.querySelectorAll('.auth-reveal'), {
      opacity: 1,
      y: 0,
      duration: 0.72,
      ease: 'power3.out',
      stagger: 0.08
    });
  }

  protected setMode(mode: AuthMode): void {
    if (this.mode() === mode || this.isSubmitting()) {
      return;
    }

    this.submitError.set(null);
    this.mode.set(mode);
  }

  protected submit(): void {
    const activeForm = this.mode() === 'signin' ? this.signInForm : this.signUpForm;
    activeForm.markAllAsTouched();

    if (activeForm.invalid || this.isSubmitting()) {
      return;
    }

    this.submitError.set(null);
    this.isSubmitting.set(true);

    if (this.mode() === 'signin') {
      this.authService.login({
        email: this.signInForm.controls.email.getRawValue().trim(),
        password: this.signInForm.controls.password.getRawValue()
      }).pipe(
        finalize(() => this.isSubmitting.set(false))
      ).subscribe({
        next: (res: LoginResponse) => {
          this.authService.saveToken(res.token);

          this.preferencesService.get().subscribe({
            next: () => void this.router.navigate([`/${APP_ROUTE_PATHS.dashboard}`]),
            error: () => void this.router.navigate([`/${APP_ROUTE_PATHS.dashboard}`])
          });
        },
        error: (error: unknown) => {
          this.submitError.set(this.getRequestErrorMessage(
            error,
            'No se pudo iniciar sesión. Revisá tus credenciales o el backend.'
          ));
        }
      });

      return;
    }

    this.authService.register({
      name: this.signUpForm.controls.fullName.getRawValue().trim(),
      email: this.signUpForm.controls.email.getRawValue().trim(),
      password: this.signUpForm.controls.password.getRawValue()
    }).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
        next: (res: LoginResponse) => {
          this.authService.saveToken(res.token);

          this.preferencesService.get().subscribe({
            next: () => void this.router.navigate([`/${APP_ROUTE_PATHS.dashboard}`]),
            error: () => void this.router.navigate([`/${APP_ROUTE_PATHS.dashboard}`])
          });
        },
        error: (error: unknown) => {
          this.submitError.set(this.getRequestErrorMessage(
            error,
            'No se pudo crear la cuenta. Revisá los datos o el backend.'
          ));
        }
    });
  }

  protected continueWithGoogle(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    window.setTimeout(() => {
      this.isSubmitting.set(false);
      void this.router.navigate([`/${APP_ROUTE_PATHS.allowLocation}`]);
    }, 700);
  }

  private getRequestErrorMessage(error: unknown, fallbackMessage: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallbackMessage;
    }

    const backendMessage = this.extractBackendMessage(error.error);

    if (backendMessage) {
      return backendMessage;
    }

    if (error.status > 0) {
      return `${fallbackMessage} (HTTP ${error.status})`;
    }

    return `${fallbackMessage} No hubo respuesta del servidor.`;
  }

  private extractBackendMessage(payload: unknown): string | null {
    if (typeof payload === 'string' && payload.trim()) {
      return payload;
    }

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const maybeMessage = 'message' in payload ? payload.message : null;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage;
    }

    const maybeError = 'error' in payload ? payload.error : null;
    if (typeof maybeError === 'string' && maybeError.trim()) {
      return maybeError;
    }

    return null;
  }
}
