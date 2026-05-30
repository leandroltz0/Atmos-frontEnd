import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuickNavComponent } from '../quick-nav/quick-nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, QuickNavComponent],
  template: `
    <router-outlet />
    <app-quick-nav />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {}
