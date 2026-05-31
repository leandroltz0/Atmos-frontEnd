import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FavoriteMetric } from '../../../features/favorites/favorites.types';

@Component({
  selector: 'app-favorites-metrics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss'
})
export class FavoritesMetricsComponent {
  readonly metrics = input.required<FavoriteMetric[]>();
}
