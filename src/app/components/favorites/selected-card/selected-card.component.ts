import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { FavoriteCity, SyncState } from '../../../features/favorites/favorites.types';

@Component({
  selector: 'app-favorites-selected-card',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selected-card.component.html',
  styleUrl: './selected-card.component.scss'
})
export class FavoritesSelectedCardComponent {
  readonly city = input<FavoriteCity | null>(null);

  readonly viewDetail = output<void>();
  readonly goToCompare = output<void>();

  protected getSyncLabel(state: SyncState): string {
    switch (state) {
      case 'synced':
        return 'Sincronizada';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Local';
    }
  }

  protected onViewDetail(): void {
    this.viewDetail.emit();
  }

  protected onGoToCompare(): void {
    this.goToCompare.emit();
  }
}
