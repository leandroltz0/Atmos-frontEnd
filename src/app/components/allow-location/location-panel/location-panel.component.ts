import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-allow-location-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './location-panel.component.html',
  styleUrl: './location-panel.component.scss'
})
export class LocationPanelComponent {
  readonly isLocationGranted = input<boolean>(false);
  readonly allowLocation = output<void>();
  readonly skip = output<void>();

  @ViewChild('headline', { read: ElementRef })
  readonly headline!: ElementRef<HTMLElement>;

  @ViewChild('description', { read: ElementRef })
  readonly description!: ElementRef<HTMLElement>;

  @ViewChild('allowBtn', { read: ElementRef })
  readonly allowBtn!: ElementRef<HTMLButtonElement>;

  @ViewChild('skipLink', { read: ElementRef })
  readonly skipLink!: ElementRef<HTMLElement>;

  protected onAllowLocation(): void {
    this.allowLocation.emit();
  }

  protected onSkip(): void {
    this.skip.emit();
  }
}
