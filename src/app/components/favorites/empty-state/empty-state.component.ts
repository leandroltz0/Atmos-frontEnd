import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-favorites-empty-state',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class FavoritesEmptyStateComponent {
  readonly addCity = output<void>();
  readonly restoreDemo = output<void>();

  protected onAddCity(): void {
    this.addCity.emit();
  }

  protected onRestoreDemo(): void {
    this.restoreDemo.emit();
  }
}
