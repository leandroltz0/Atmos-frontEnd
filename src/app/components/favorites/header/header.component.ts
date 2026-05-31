import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-favorites-header',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class FavoritesHeaderComponent {
  readonly addCity = output<void>();
  readonly scrollToCompare = output<void>();

  protected onAddCity(): void {
    this.addCity.emit();
  }

  protected onScrollToCompare(): void {
    this.scrollToCompare.emit();
  }
}
