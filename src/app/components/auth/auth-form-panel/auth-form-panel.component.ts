import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  output,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type AuthMode = 'signin' | 'signup';

@Component({
  selector: 'app-auth-form-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './auth-form-panel.component.html',
  styleUrl: './auth-form-panel.component.scss'
})
export class AuthFormPanelComponent {
  readonly mode = input.required<AuthMode>();
  readonly isSubmitting = input.required<boolean>();
  readonly submitError = input<string | null>();
  readonly signInForm = input.required<FormGroup>();
  readonly signUpForm = input.required<FormGroup>();

  readonly modeChange = output<AuthMode>();
  readonly submit = output<void>();
  readonly continueWithGoogle = output<void>();

  protected readonly hideSignInPassword = signal(true);
  protected readonly hideSignUpPassword = signal(true);
  protected readonly hideConfirmPassword = signal(true);

  protected onModeChange(value: AuthMode): void {
    this.modeChange.emit(value);
  }

  protected onSubmit(): void {
    this.submit.emit();
  }

  protected onGoogleClick(): void {
    this.continueWithGoogle.emit();
  }

  protected setMode(mode: AuthMode): void {
    this.modeChange.emit(mode);
  }

  protected toggleSignInPasswordVisibility(): void {
    this.hideSignInPassword.update((v) => !v);
  }

  protected toggleSignUpPasswordVisibility(): void {
    this.hideSignUpPassword.update((v) => !v);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((v) => !v);
  }

  protected shouldShowControlError(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  protected getPasswordMismatchError(): boolean {
    const form = this.signUpForm();
    return form.hasError('passwordMismatch')
      && this.shouldShowControlError(form.get('confirmPassword'));
  }
}
