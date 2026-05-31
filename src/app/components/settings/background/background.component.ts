import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings-background',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class SettingsBackgroundComponent {}
