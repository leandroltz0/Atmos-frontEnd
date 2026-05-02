import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SectionCardComponent } from '../section-card';

type Star = {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
};

const MOON_CENTER = 60;
const MOON_RADIUS = 48;
const FULL_MOON_PHASE = 0.5;
const FULL_MOON_THRESHOLD = 0.001;

@Component({
  selector: 'app-moon-phase',
  standalone: true,
  imports: [CommonModule, SectionCardComponent],
  templateUrl: './moon-phase.component.html',
  styleUrl: './moon-phase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoonPhaseComponent {
  @Input() phase = 0.72;
  @Input() phaseName = 'Gibosa menguante';
  @Input() illumination = 68;
  @Input() moonrise = '21:14';
  @Input() moonset = '08:32';

  protected readonly moonCenter = MOON_CENTER;
  protected readonly moonRadius = MOON_RADIUS;

  protected readonly stars: Star[] = [
    { cx: 18, cy: 22, r: 1.6, opacity: 0.42 },
    { cx: 101, cy: 18, r: 1.4, opacity: 0.36 },
    { cx: 24, cy: 92, r: 1.5, opacity: 0.44 },
    { cx: 92, cy: 97, r: 1.5, opacity: 0.4 },
    { cx: 108, cy: 73, r: 1.3, opacity: 0.34 }
  ];

  protected get normalizedPhase(): number {
    return this.clamp(this.phase, 0, 1);
  }

  protected get normalizedIllumination(): number {
    return this.clamp(this.illumination, 0, 100);
  }

  protected get overlayCx(): number {
    const radians = this.normalizedPhase * Math.PI * 2;

    return MOON_CENTER + Math.sin(radians) * MOON_RADIUS;
  }

  protected get overlayOpacity(): number {
    if (Math.abs(this.normalizedPhase - FULL_MOON_PHASE) <= FULL_MOON_THRESHOLD) {
      return 0;
    }

    return 1 - this.normalizedIllumination / 100;
  }

  protected get illuminationLabel(): string {
    return `${Math.round(this.normalizedIllumination)}%`;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
