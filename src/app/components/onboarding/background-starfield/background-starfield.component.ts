import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { createStarfieldState, drawStarfieldFrame, StarfieldState } from '../../../shared/utils/canvas-starfield';

@Component({
  selector: 'app-background-starfield',
  standalone: true,
  templateUrl: './background-starfield.component.html',
  styleUrl: './background-starfield.component.scss'
})
export class BackgroundStarfieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas', { static: true })
  private readonly bgCanvasRef?: ElementRef<HTMLCanvasElement>;

  private starfield?: StarfieldState;
  private animationFrameId?: number;
  private startTime?: number;

  constructor(private readonly ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.resize();
    this.ngZone.runOutsideAngular(() => this.startLoop());
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.resize();
  }

  private resize(): void {
    const canvas = this.bgCanvasRef?.nativeElement;
    if (!canvas) return;
    this.starfield = createStarfieldState(canvas) ?? undefined;
  }

  private startLoop(): void {
    const tick = (timestamp: number) => {
      if (!this.startTime) this.startTime = timestamp;
      if (!this.starfield) return;
      const elapsedSeconds = (timestamp - this.startTime) / 1000;
      drawStarfieldFrame(this.starfield, elapsedSeconds);
      this.animationFrameId = requestAnimationFrame(tick);
    };
    this.animationFrameId = requestAnimationFrame(tick);
  }
}
