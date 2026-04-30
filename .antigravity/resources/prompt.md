# PROMPT — Pantalla `allow-location` · ATMOS Weather App

## Contexto del proyecto

Estás trabajando en **ATMOS**, una aplicación de clima premium construida con **Angular + Ionic**. El stack técnico disponible es:

- **Angular Material** (componentes UI y theming)
- **GSAP** (animaciones de entrada, timeline, partículas)
- **Three.js** (globo 3D interactivo como pieza hero)
- **SCSS** con variables del design system del proyecto
- Fuentes: **Outfit** (headings) y **Inter** (body) vía Google Fonts

La pantalla a implementar es `allow-location`: onboarding que solicita permiso de geolocalización. Debe ser **visualmente impresionante, premium y con animaciones fluidas**.

---

## Diseño por breakpoint

### Mobile (< 768px)

- Layout vertical. Globo en la mitad superior, centrado. Tamaño `200px`.
- Contenido anclado en la mitad inferior (headline + descripción + botones).
- Fondo: espacio profundo con nebulosa y estrellas animadas.

### Tablet (768px – 1023px)

- Layout vertical. Globo más grande: `240px`. Más padding y tipografía levemente mayor.

### Desktop (>= 1024px)

- **Split-screen horizontal 60/40**: panel izquierdo con globo, panel derecho con contenido.
- Globo: `220px`, centrado en el panel izquierdo.
- Barra de título tipo browser (`● ● ●`) en el borde superior del layout.

---

## Tokens de diseño

```scss
--atmos-bg: #04080f;
--atmos-surface: #06101e;
--atmos-accent: #38bdf8;
--atmos-accent-dark: #0f172a;
--atmos-text-primary: #f8fafc;
--atmos-text-secondary: #94a3b8;
--atmos-text-muted: #475569;
--atmos-border: rgba(255, 255, 255, 0.06);
```

---

## Archivos a crear

```
src/app/pages/allow-location/
  ├── allow-location.page.html
  ├── allow-location.page.scss
  └── allow-location.page.ts
```

---

## HTML — Estructura completa

```html
<div class="allow-location-root" #rootRef>
  <canvas class="bg-canvas" #bgCanvas></canvas>
  <div class="particles-layer" #particlesLayer></div>

  <div class="globe-wrap" #globeWrap>
    <canvas class="globe-canvas" #globeCanvas></canvas>
    <div class="pin-dot" #pinDot></div>
  </div>

  <div class="content-panel" #contentPanel>
    <h1 class="headline" #headline>
      Know your sky,<br />
      <span class="accent">wherever</span> you are.
    </h1>
    <p class="description" #description>ATMOS delivers hyperlocal weather — real-time conditions, precise forecasts, and smart alerts built around you.</p>

    <button mat-flat-button class="allow-btn" #allowBtn (click)="onAllowLocation()">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
      Allow Location
    </button>

    <span class="skip-link" #skipLink (click)="onSkip()">Not now</span>
  </div>
</div>
```

---

## SCSS — Estilos completos

```scss
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=Inter:wght@400;500&display=swap");

.allow-location-root {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  overflow: hidden;
  background: #04080f;
  display: flex;
  flex-direction: column;
}

.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particles-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.globe-wrap {
  position: absolute;
  z-index: 5;
  pointer-events: none;
}

.globe-canvas {
  border-radius: 50%;
  display: block;
}

// Pin dot: SIN glow ring exterior, solo pin + ripple
.pin-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 9px;
  height: 9px;
  background: #38bdf8;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.22);
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    inset: -7px;
    border-radius: 50%;
    border: 1px solid rgba(56, 189, 248, 0.3);
    animation: ripple 2.4s ease-out infinite;
  }
}

// Contenido: mobile y tablet abajo, desktop a la derecha
.content-panel {
  position: absolute;
  z-index: 10;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 28px 44px;

  @media (min-width: 768px) {
    padding: 0 36px 52px;
  }

  @media (min-width: 1024px) {
    top: 0;
    right: 0;
    bottom: 0;
    left: auto;
    width: 46%;
    padding: 0 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.headline {
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.12;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  font-size: 26px;

  @media (min-width: 768px) {
    font-size: 30px;
  }
  @media (min-width: 1024px) {
    font-size: 26px;
  }
}

.accent {
  color: #38bdf8;
}

.description {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  color: #94a3b8;
  line-height: 1.65;
  margin-bottom: 26px;
  font-size: 13px;

  @media (min-width: 768px) {
    font-size: 14px;
    margin-bottom: 30px;
  }
  @media (min-width: 1024px) {
    font-size: 13px;
    margin-bottom: 26px;
  }
}

// Botón: SIN box-shadow azul exterior (glow eliminado)
.allow-btn {
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #38bdf8 !important;
  color: #0f172a !important;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  margin-bottom: 12px;
  border: none !important;
  box-shadow: none !important; // ← CRÍTICO: sin glow exterior
  height: 50px;
  font-size: 15px;
  border-radius: 14px;

  @media (min-width: 768px) {
    height: 54px;
    font-size: 16px;
    border-radius: 16px;
  }
  @media (min-width: 1024px) {
    height: 48px;
    font-size: 14px;
    border-radius: 13px;
  }

  // Solo shimmer interno permitido
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.16) 50%, transparent 60%);
    transform: translateX(-100%);
    animation: shimmer 3.2s ease-in-out infinite 1.4s;
  }

  .btn-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    stroke: #0f172a;
  }
}

.skip-link {
  font-family: "Inter", sans-serif;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  display: block;
  text-align: center;
  transition: color 0.2s;
  &:hover {
    color: #94a3b8;
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
}
@keyframes shimmer {
  to {
    transform: translateX(220%);
  }
}
@keyframes floatUp {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-900px) scale(0.2);
    opacity: 0;
  }
}
```

---

## TypeScript — Lógica completa

### Decorator y estructura del componente

El componente es **standalone** (mismo patrón que el resto del proyecto):

```typescript
@Component({
  selector: "app-allow-location",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./allow-location.page.html",
  styleUrls: ["./allow-location.page.scss"],
})
export class AllowLocationPage implements AfterViewInit, OnDestroy {
  constructor(
    private readonly ngZone: NgZone,
    private readonly router: Router,
  ) {}
  // ... resto de la clase
}
```

> **Importante:** El loop de Three.js (`requestAnimationFrame`) debe correr con `this.ngZone.runOutsideAngular(() => this.renderLoop())` para evitar que Angular detecte cambios en cada frame y degrade el rendimiento.

### Imports

```typescript
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener, NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { gsap } from "gsap";
import * as THREE from "three";
```

### ViewChilds y propiedades

```typescript
@ViewChild('bgCanvas')       bgCanvas!: ElementRef<HTMLCanvasElement>;
@ViewChild('globeCanvas')    globeCanvas!: ElementRef<HTMLCanvasElement>;
@ViewChild('globeWrap')      globeWrap!: ElementRef<HTMLDivElement>;
@ViewChild('particlesLayer') particlesLayer!: ElementRef<HTMLDivElement>;
@ViewChild('rootRef')        rootRef!: ElementRef<HTMLDivElement>;
@ViewChild('headline')       headline!: ElementRef;
@ViewChild('description')    description!: ElementRef;
@ViewChild('allowBtn')       allowBtn!: ElementRef;
@ViewChild('skipLink')       skipLink!: ElementRef;
@ViewChild('pinDot')         pinDot!: ElementRef;

private renderer!: THREE.WebGLRenderer;
private scene!: THREE.Scene;
private camera!: THREE.PerspectiveCamera;
private globe!: THREE.Mesh;
private animationId!: number;
private bgAnimId!: number;
private bgCtx!: CanvasRenderingContext2D;
private stars: { x:number; y:number; r:number; speed:number; phase:number }[] = [];
private nebula1!: CanvasGradient;
private nebula2!: CanvasGradient;
private entryTL!: gsap.core.Timeline;
private isLocationGranted = false;
private bgStart: number | null = null;
```

### Ciudades para puntos del globo

```typescript
private readonly CITIES = [
  [40.7,-74],[51.5,-0.1],[35.7,139.7],[-33.9,151.2],[48.9,2.3],
  [19.1,72.9],[-23.5,-46.6],[55.8,37.6],[1.3,103.8],[-1.3,36.8],
  [30,31.2],[41,28.9],[25.2,55.3],[-34.6,-58.4],[37.8,-122.4],
  [52.5,13.4],[59.9,30.3],[39.9,116.4],[28.6,77.2],[33.9,-6.9]
];
```

### Breakpoint config

```typescript
private getBreakpointConfig() {
  const w = window.innerWidth;
  if (w >= 1024) return { globeSize: 220, layout: 'desktop' as const };
  if (w >= 768)  return { globeSize: 240, layout: 'tablet'  as const };
  return               { globeSize: 200, layout: 'mobile'  as const };
}
```

### `ngAfterViewInit`

```typescript
ngAfterViewInit() {
  this.setupBackground();
  this.setupGlobe();
  this.setupParticles();
  this.positionGlobe();
  this.playEntryAnimation();
}
```

### Background 2D (estrellas + nebulosa)

```typescript
private setupBackground() {
  const canvas = this.bgCanvas.nativeElement;
  const W = canvas.offsetWidth || window.innerWidth;
  const H = canvas.offsetHeight || window.innerHeight;
  canvas.width = W; canvas.height = H;
  this.bgCtx = canvas.getContext('2d')!;

  this.nebula1 = this.bgCtx.createRadialGradient(W*0.35, H*0.38, 0, W*0.35, H*0.38, W*0.55);
  this.nebula1.addColorStop(0,   'rgba(14,30,60,0.6)');
  this.nebula1.addColorStop(0.4, 'rgba(8,18,38,0.5)');
  this.nebula1.addColorStop(1,   'rgba(3,7,16,0)');

  this.nebula2 = this.bgCtx.createRadialGradient(W*0.7, H*0.6, 0, W*0.7, H*0.6, W*0.4);
  this.nebula2.addColorStop(0, 'rgba(10,25,50,0.4)');
  this.nebula2.addColorStop(1, 'rgba(3,7,16,0)');

  this.stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.0 + 0.2,
    speed: Math.random() * 0.003 + 0.001,
    phase: Math.random() * Math.PI * 2,
  }));

  const tick = (ts: number) => {
    if (!this.bgStart) this.bgStart = ts;
    const t = (ts - this.bgStart) / 1000;
    const cx = this.bgCtx;
    cx.fillStyle = '#030810'; cx.fillRect(0, 0, W, H);
    cx.fillStyle = this.nebula1; cx.fillRect(0, 0, W, H);
    cx.fillStyle = this.nebula2; cx.fillRect(0, 0, W, H);
    this.stars.forEach(s => {
      const a = 0.12 + 0.45 * Math.abs(Math.sin(t * s.speed + s.phase));
      cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(220,235,255,${a})`; cx.fill();
    });
    this.bgAnimId = requestAnimationFrame(tick);
  };
  this.bgAnimId = requestAnimationFrame(tick);
}
```

### Globo Three.js

```typescript
private latLonToVec3(lat: number, lon: number, R: number): THREE.Vector3 {
  const phi   = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -R * Math.sin(phi) * Math.cos(theta),
     R * Math.cos(phi),
     R * Math.sin(phi) * Math.sin(theta)
  );
}

private setupGlobe() {
  const { globeSize } = this.getBreakpointConfig();
  const canvas = this.globeCanvas.nativeElement;

  this.scene    = new THREE.Scene();
  this.camera   = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  this.camera.position.z = 2.2;

  this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  this.renderer.setSize(globeSize, globeSize);
  this.renderer.setClearColor(0x000000, 0);

  // Iluminación
  this.scene.add(new THREE.AmbientLight(0x0a1628, 2.5));
  const dirLight = new THREE.DirectionalLight(0x38BDF8, 0.3);
  dirLight.position.set(-1, 1, 1);
  this.scene.add(dirLight);
  const ptLight = new THREE.PointLight(0x38BDF8, 0.15);
  ptLight.position.set(-1, 1, 2);
  this.scene.add(ptLight);

  const R = 1;

  // Globo base (océano oscuro)
  const geo  = new THREE.SphereGeometry(R, 64, 64);
  const mat  = new THREE.MeshPhongMaterial({
    color: 0x081428, emissive: 0x020710, shininess: 15
  });
  this.globe = new THREE.Mesh(geo, mat);
  this.scene.add(this.globe);

  // Wireframe de grilla (lat/lon)
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x38BDF8, wireframe: true,
    transparent: true, opacity: 0.045
  });
  this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(R + 0.001, 24, 24), wireMat));

  // Atmosphere rim
  const atmMat = new THREE.MeshBasicMaterial({
    color: 0x38BDF8, side: THREE.BackSide,
    transparent: true, opacity: 0.12
  });
  this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.04, 32, 32), atmMat));

  // City dots
  const positions: number[] = [];
  this.CITIES.forEach(([lat, lon]) => {
    const v = this.latLonToVec3(lat, lon, R + 0.01);
    positions.push(v.x, v.y, v.z);
  });
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({ color: 0x38BDF8, size: 0.04 });
  this.scene.add(new THREE.Points(pointsGeo, pointsMat));

  // Loop de render
  const tick = () => {
    this.globe.rotation.y += 0.003;
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(tick);
  };
  this.animationId = requestAnimationFrame(tick);
}
```

### Partículas GSAP

```typescript
private setupParticles() {
  const container = this.particlesLayer.nativeElement;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const sz = Math.random() * 2 + 0.6;
    Object.assign(p.style, {
      position: 'absolute', borderRadius: '50%',
      background: 'rgba(56,189,248,0.45)',
      width: `${sz}px`, height: `${sz}px`,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 20}%`,
      pointerEvents: 'none',
    });
    container.appendChild(p);
    gsap.to(p, {
      y: -window.innerHeight * 1.1,
      scale: 0.2, opacity: 0,
      duration: 8 + Math.random() * 9,
      delay: Math.random() * 8,
      ease: 'none', repeat: -1,
      repeatDelay: Math.random() * 4,
    });
  }
}
```

### Posicionamiento del globo

```typescript
private positionGlobe() {
  const { globeSize, layout } = this.getBreakpointConfig();
  const wrap = this.globeWrap.nativeElement;
  wrap.style.width  = `${globeSize}px`;
  wrap.style.height = `${globeSize}px`;

  if (layout === 'desktop') {
    wrap.style.top  = '50%';
    wrap.style.left = '27%';
    wrap.style.transform = 'translate(-50%, -50%)';
  } else {
    const topOffset = layout === 'tablet' ? 100 : 60;
    wrap.style.top  = `${topOffset}px`;
    wrap.style.left = '50%';
    wrap.style.transform = 'translateX(-50%)';
  }

  if (this.renderer) {
    this.renderer.setSize(globeSize, globeSize);
    this.camera.updateProjectionMatrix();
  }
}
```

### Animación de entrada GSAP

```typescript
private playEntryAnimation() {
  gsap.set([
    this.headline.nativeElement,
    this.description.nativeElement,
    this.allowBtn.nativeElement,
    this.skipLink.nativeElement,
  ], { opacity: 0, y: 24 });
  gsap.set(this.globeWrap.nativeElement, { opacity: 0, scale: 0.85 });
  gsap.set(this.pinDot.nativeElement, { scale: 0, opacity: 0 });

  this.entryTL = gsap.timeline({ delay: 0.3 });

  // 1. Globo: scale bounce
  this.entryTL.to(this.globeWrap.nativeElement, {
    opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.4)',
  });

  // 2. Pin dot
  this.entryTL.to(this.pinDot.nativeElement, {
    scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
  }, '-=0.4');

  // 3. Headline
  this.entryTL.to(this.headline.nativeElement, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
  }, '-=0.2');

  // 4. Descripción
  this.entryTL.to(this.description.nativeElement, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
  }, '-=0.4');

  // 5. Botón
  this.entryTL.to(this.allowBtn.nativeElement, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
  }, '-=0.3');

  // 6. Skip
  this.entryTL.to(this.skipLink.nativeElement, {
    opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
  }, '-=0.2');

  // 7. Floating loop del globo
  this.entryTL.add(() => {
    gsap.to(this.globeWrap.nativeElement, {
      y: -10, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
  });
}
```

### Handlers de acciones

```typescript
onAllowLocation() {
  if (this.isLocationGranted) return;
  this.isLocationGranted = true;
  const btn = this.allowBtn.nativeElement;

  gsap.timeline()
    .to(btn, { scale: 0.96, duration: 0.08, ease: 'power1.in' })
    .to(btn, { scale: 1, duration: 0.2, ease: 'back.out(2)' })
    .add(() => {
      btn.style.background = '#22C55E';
      btn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none"
             stroke="#0F172A" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Location Enabled
      `;
    });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => setTimeout(() => this.router.navigate(['/home']), 1200),
      () => setTimeout(() => this.router.navigate(['/home']), 1200)
    );
  } else {
    setTimeout(() => this.router.navigate(['/home']), 1200);
  }
}

onSkip() {
  gsap.to(this.rootRef.nativeElement, {
    opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
    onComplete: () => this.router.navigate(['/home']),
  });
}
```

### `ngOnDestroy`

```typescript
ngOnDestroy() {
  cancelAnimationFrame(this.animationId);
  cancelAnimationFrame(this.bgAnimId);
  this.entryTL?.kill();
  gsap.killTweensOf(this.globeWrap?.nativeElement);
  // Dispose Three.js para evitar memory leaks
  this.scene?.traverse(obj => {
    if ((obj as THREE.Mesh).isMesh) {
      (obj as THREE.Mesh).geometry?.dispose();
      const mat = (obj as THREE.Mesh).material;
      if (Array.isArray(mat)) mat.forEach(m => m.dispose());
      else (mat as THREE.Material)?.dispose();
    }
  });
  this.renderer?.dispose();
}
```

---

## Reglas estrictas (NO negociables)

> [!IMPORTANT]
> Las siguientes reglas deben respetarse sin excepción:

1. **Sin glow azul exterior en el botón**: `box-shadow: none !important` en `.allow-btn`. Solo el shimmer `::after` interno está permitido.
2. **Sin `.glow-ring` en el globo**: Eliminar completamente el `div.glow-ring` con `radial-gradient` y animación `pulse`. El único "glow" permitido es el `atmosphere rim` de Three.js (esfera BackSide).
3. **Angular Material**: Usar `mat-flat-button` en el botón principal. Sobreescribir estilos con `!important` donde sea necesario.
4. **Colores exactos**: Solo usar los tokens definidos. No introducir nuevos tonos.
5. **Sin media queries en TS**: El posicionamiento del globo se hace únicamente en `positionGlobe()` / `getBreakpointConfig()`.
6. **GSAP para UI, Three.js para el globo**: No mezclar responsabilidades.
7. **Dispose en `ngOnDestroy`**: Limpiar todos los `requestAnimationFrame`, timelines de GSAP y recursos de Three.js.

---

## Checklist de verificación

- [ ] Globo Three.js rota suavemente en los 3 breakpoints
- [ ] Partículas flotantes animadas con GSAP (no CSS)
- [ ] Animación de entrada secuencial: globo → pin → headline → descripción → botón → skip
- [ ] Botón **sin glow azul exterior**
- [ ] Globo **sin glow ring exterior**
- [ ] Click en "Allow Location": bounce + color verde + checkmark
- [ ] Layout correcto en mobile, tablet y desktop
- [ ] `ngOnDestroy` limpia todos los recursos
- [ ] No hay memory leaks de Three.js
