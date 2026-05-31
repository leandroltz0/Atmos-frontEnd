import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProfileStat } from '../../../features/profile/profile.types';

@Component({
  selector: 'app-profile-stats-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats-grid.component.html',
  styleUrl: './stats-grid.component.scss'
})
export class ProfileStatsGridComponent {
  readonly stats = input.required<ProfileStat[]>();
}
