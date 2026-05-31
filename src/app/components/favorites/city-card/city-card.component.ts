import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { FavoriteCity, SyncState } from '../../../features/favorites/favorites.types';

@Component({
  selector: 'app-favorites-city-card',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss'
})
export class FavoritesCityCardComponent {
  readonly city = input.required<FavoriteCity>();
  readonly selected = input(false);
  readonly compared = input(false);

  readonly select = output<void>();
  readonly toggleCompare = output<MouseEvent>();
  readonly moveUp = output<MouseEvent>();
  readonly moveDown = output<MouseEvent>();
  readonly remove = output<MouseEvent>();

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

  protected onSelect(): void {
    this.select.emit();
  }

  protected onToggleCompare(event: MouseEvent): void {
    this.toggleCompare.emit(event);
  }

  protected onMoveUp(event: MouseEvent): void {
    this.moveUp.emit(event);
  }

  protected onMoveDown(event: MouseEvent): void {
    this.moveDown.emit(event);
  }

  protected onRemove(event: MouseEvent): void {
    this.remove.emit(event);
  }
}
