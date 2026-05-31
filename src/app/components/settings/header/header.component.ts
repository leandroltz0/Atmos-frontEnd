import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings-header',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class SettingsHeaderComponent {
  readonly appVersion = input.required<string>();

  readonly goBack = output<void>();

  protected onGoBack(): void {
    this.goBack.emit();
  }
}
