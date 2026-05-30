import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

const PARTICLE_COUNT = 12;

@Component({
  selector: 'app-allow-location-particles',
  standalone: true,
  templateUrl: './particles.component.html',
  styleUrl: './particles.component.scss'
})
export class ParticlesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('layer', { static: true })
  private readonly layerRef!: ElementRef<HTMLDivElement>;

  private particleElements: HTMLElement[] = [];

  ngAfterViewInit(): void {
    this.setupParticles();
  }

  ngOnDestroy(): void {
    gsap.killTweensOf(this.particleElements);
    this.layerRef.nativeElement.innerHTML = '';
  }

  private setupParticles(): void {
    const container = this.layerRef.nativeElement;

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const particle = this.createParticle();
      container.appendChild(particle);
      this.particleElements.push(particle);

      gsap.to(particle, {
        y: -window.innerHeight * 1.1,
        scale: 0.2,
        opacity: 0,
        duration: 8 + Math.random() * 9,
        delay: Math.random() * 8,
        ease: 'none',
        repeat: -1,
        repeatDelay: Math.random() * 4
      });
    }
  }

  private createParticle(): HTMLDivElement {
    const particle = document.createElement('div');
    const size = Math.random() * 2 + 0.6;

    Object.assign(particle.style, {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(56,189,248,0.45)',
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 20}%`,
      opacity: '0',
      pointerEvents: 'none'
    } satisfies Partial<CSSStyleDeclaration>);

    return particle;
  }
}
