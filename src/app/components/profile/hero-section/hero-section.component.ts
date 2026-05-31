import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-profile-hero-section',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class ProfileHeroSectionComponent {
  readonly initials = input.required<string>();
  readonly userName = input.required<string>();
  readonly email = input.required<string>();
  readonly memberSince = input.required<string>();
  readonly isEditingName = input(false);
  readonly editNameValue = input('');
  readonly isSavingName = input(false);

  readonly avatarClick = output<void>();
  readonly startEdit = output<void>();
  readonly saveName = output<void>();
  readonly cancelEdit = output<void>();
  readonly editNameChange = output<string>();

  protected onAvatarClick(): void {
    this.avatarClick.emit();
  }

  protected onStartEdit(): void {
    this.startEdit.emit();
  }

  protected onSaveName(): void {
    this.saveName.emit();
  }

  protected onCancelEdit(): void {
    this.cancelEdit.emit();
  }

  protected onEditNameInput(value: string): void {
    this.editNameChange.emit(value);
  }
}
