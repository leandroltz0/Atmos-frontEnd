import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-content-panel',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './content-panel.component.html',
  styleUrl: './content-panel.component.scss'
})
export class ContentPanelComponent {
  readonly getStarted = output<void>();

  protected onGetStarted(): void {
    this.getStarted.emit();
  }
}
