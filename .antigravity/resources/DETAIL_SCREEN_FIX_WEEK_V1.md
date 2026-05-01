# Pantalla 04 — Detalle del Clima: FIX visual Tab "Esta Semana"

**Para:** Codex  
**Tarea:** Corregir defectos visuales del Tab "Esta Semana" de la pantalla Detail  
**Archivos a modificar:** `src/app/pages/detail/detail.page.html`, `detail.page.scss`, `detail.page.ts`

---

## Defectos detectados

### 🔴 CRÍTICO — Barra de temperatura sin posición relativa en el rango global

**Problema actual:** Todas las barras de temperatura empiezan desde la misma posición izquierda. Solo varía el ancho. Esto hace imposible comparar visualmente las temperaturas entre días.

**Cómo se ve ahora (incorrecto):**
```
Sáb  Min 11°  ████████░░░░░░░░░░░░  Max 17°
Dom  Min 10°  ████████░░░░░░░░░░░░  Max 16°
Mar  Min 12°  ██████████████████░░  Max 22°
              ↑ todas empiezan del mismo punto
```

**Cómo DEBE verse (correcto):**
```
              9°       14°       19°       22°
Sáb  Min 11°    ████████              Max 17°
Dom  Min 10°   ████████              Max 16°
Mar  Min 12°      ██████████████████  Max 22°
              ↑ cada barra empieza donde corresponde su Min
```

**Fix — Agregar método `getTempBarOffset()` al componente:**

```typescript
// El rango global de la semana
protected readonly weekTempRange = computed(() => {
  const allTemps = this.weather().daily.flatMap(d => [d.tempMin, d.tempMax]);
  return { min: Math.min(...allTemps), max: Math.max(...allTemps) };
});

// Offset izquierdo proporcional (porcentaje)
protected getTempBarOffset(day: DailyForecast): number {
  const { min, max } = this.weekTempRange();
  const range = Math.max(max - min, 1);
  return ((day.tempMin - min) / range) * 100;
}

// Ancho proporcional (porcentaje)
protected getTempBarWidth(day: DailyForecast): number {
  const { min, max } = this.weekTempRange();
  const range = Math.max(max - min, 1);
  return ((day.tempMax - day.tempMin) / range) * 100;
}
```

**En el template HTML**, la barra debe tener un contenedor con posición relativa y el fill con `left` y `width` dinámicos:

```html
<div class="temp-bar">
  <div
    class="temp-bar__fill"
    [style.left.%]="getTempBarOffset(day)"
    [style.width.%]="getTempBarWidth(day)"
  ></div>
</div>
```

**CSS de la barra:**
```scss
.temp-bar {
  position: relative;
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.temp-bar__fill {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #48cae4, #3a86ff);
  transition: left 0.6s ease, width 0.6s ease;
}
```

> **IMPORTANTE:** El fill ya NO puede usar solo `width`. Necesita `position: absolute` + `left` + `width` para posicionarse correctamente dentro del contenedor.

---

### 🟡 MEDIO — Gap excesivo entre cards de cada día

**Problema:** Las cards de cada día están demasiado separadas verticalmente. Parece una lista con demasiado aire entre elementos. Pierde la cohesión visual de "lista semanal".

**Fix — Dos opciones, elegir UNA:**

**Opción A (recomendada) — Lista continua dentro de UNA sola glass-card:**
Envolver todos los días en un solo contenedor `glass-card` con rows separadas por dividers sutiles, igual que el dashboard:

```html
<div class="week-list glass-card">
  @for (day of weather().daily; track day.date) {
    <div class="week-row">
      <!-- contenido del día -->
    </div>
    @if (!$last) {
      <div class="week-divider" aria-hidden="true"></div>
    }
  }
</div>
```

```scss
.week-list {
  padding: 0.5rem 0;
}

.week-row {
  padding: 0.875rem 1.1rem;
  transition: background-color 180ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
}

.week-divider {
  height: 1px;
  margin: 0 1.1rem;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.06) 20%,
    rgba(255, 255, 255, 0.06) 80%,
    transparent
  );
}
```

**Opción B — Mantener cards individuales pero reducir gap:**
Si se mantienen cards separadas, reducir el gap a `6px` máximo y asegurar que todas tengan `glass-card`.

---

### 🟡 MEDIO — Cards sin glassmorphism real

**Problema:** Las cards de cada día se ven como rectángulos oscuros sólidos, sin efecto vidrio.

**Fix:** Verificar que cada card tenga la clase `glass-card` Y que el fondo con orbes esté renderizándose detrás. Recordar que el glassmorphism necesita ambas cosas:

1. **El elemento:** `backdrop-filter: blur(16px) saturate(180%)` + `background: rgba(255, 255, 255, 0.04)` + `border: 1px solid rgba(255, 255, 255, 0.08)` + `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06)`
2. **El fondo:** Los 3 orbes de `dashboard-bg` DEBEN estar renderizándose detrás con `position: fixed`

Si se elige la Opción A (lista continua), el glass va en el contenedor `.week-list`, no en cada row.

---

### 🟢 MENOR — Espacio vertical interno excesivo

**Problema:** Dentro de cada card, la fila del viento (ej: "⇆ 16 km/h SE") está demasiado separada de la fila principal (día + temp). Se desperdicia espacio vertical.

**Fix:**
```scss
.week-row {
  display: flex;
  flex-direction: column;
  gap: 4px; // Reducir de lo que sea actualmente a 4px

  &__main {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__wind {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-left: 0; // Alinear con el inicio del contenido
    font-size: 11px;
    color: var(--color-text-secondary);
    font-family: 'JetBrains Mono', monospace;
  }
}
```

---

### 🟢 MENOR — Sin hover effect en las cards/rows

**Problema:** Las cards no reaccionan al hover. Se sienten inertes.

**Fix:** Agregar transición sutil:

Si se usa Opción A (lista continua):
```scss
.week-row {
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 180ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
}
```

Si se mantienen cards individuales:
```scss
.week-card {
  transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
}
```

---

## Prioridad de implementación

1. 🔴 **Barra de temperatura con posición relativa** — este es el fix más importante, cambia completamente la utilidad de la visualización
2. 🟡 **Unificar en lista continua** (Opción A) — elimina el gap excesivo y da cohesión
3. 🟡 **Glassmorphism** — verificar clase `glass-card` y presencia de orbes
4. 🟢 **Reducir espacio interno** entre fila principal y fila de viento
5. 🟢 **Hover effects** en rows

---

## NO tocar

- ❌ No cambiar Tab Hoy ni Tab Detalle
- ❌ No cambiar el header ni los tabs
- ❌ No cambiar datos mock ni interfaces
- ❌ No instalar dependencias nuevas
- ❌ No modificar la estructura de routing

---

_ATMOS — Fix visual Tab "Esta Semana" v1. Componente: `src/app/pages/detail/`_
