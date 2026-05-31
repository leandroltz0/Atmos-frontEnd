import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-favorites-error',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class FavoritesErrorComponent {
  readonly errorMessage = input<string>('');
  readonly retry = output<void>();
  readonly restoreDemo = output<void>();

  protected onRetry(): void {
    this.retry.emit();
  }

  protected onRestoreDemo(): void {
    this.restoreDemo.emit();
  }
}
