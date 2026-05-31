import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

import { ProfileAction } from '../../../features/profile/profile.types';

@Component({
  selector: 'app-profile-action-group',
  standalone: true,
  imports: [MatIconModule, MatRippleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './action-group.component.html',
  styleUrl: './action-group.component.scss'
})
export class ProfileActionGroupComponent {
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly iconVariant = input<'default' | 'session'>('default');
  readonly actions = input.required<ProfileAction[]>();

  readonly actionTriggered = output<string>();

  protected onAction(id: string): void {
    this.actionTriggered.emit(id);
  }
}
