# ATMOS — Product Requirements Document (PRD)

> Este documento describe el estado actual del proyecto ATMOS, una aplicación web de clima construida con Angular 19 y un backend en Express. Está pensado para que una IA pueda entender rápidamente el proyecto y colaborar en su desarrollo.

---

## 1. Visión general

**ATMOS** es una aplicación web de clima con diseño premium, orientada a usuarios que quieren consultar el clima de múltiples ciudades de forma elegante y eficiente. El foco está puesto en la experiencia visual, la fluidez de las animaciones y la claridad de los datos meteorológicos.

---

## 2. Stack tecnológico

### Frontend

- **Framework:** Angular 19
- **UI Library:** Angular Material
- **Animaciones:** GSAP (GreenSock Animation Platform)
- **Lenguaje:** TypeScript
- **Estilos:** SCSS

### Backend

- **Framework:** Express.js (Node.js)
- **API de clima:** Open-Meteo (API gratuita, sin key requerida)

### Estructura de carpetas (Frontend)

```
frontEnd/
└── src/
    └── app/
        ├── assets/
        ├── components/
        ├── core/
        ├── features/
        │   ├── allow-location/
        │   ├── dashboard/
        │   ├── detail/
        │   ├── favorites/
        │   ├── onboarding/
        │   ├── profile/
        │   ├── search/
        │   └── settings/
        ├── shared/
        └── types/
```

---

## 3. Diseño y sistema visual

### Estética general

- **Estilo:** Glassmorphism sobre fondos oscuros
- **Tema:** Dark mode exclusivo
- **Paleta de colores:**
  - Fondo base: Azul marino profundo (`#050d1a` aprox.)
  - Superficies/cards: Azul oscuro translúcido con blur (glassmorphism)
  - Acento primario: Azul eléctrico (`#3B82F6` aprox.)
  - Acento secundario: Verde agua (para estados "sincronizado")
  - Acento terciario: Amarillo/dorado (para estados "local")
  - Texto primario: Blanco / gris claro
  - Texto secundario: Gris azulado tenue

### Tipografía

- **Títulos grandes:** Tipografía serif elegante (estilo editorial — ej. para el headline "Know your sky, wherever you are.")
- **Datos y UI:** Sans-serif limpia (Angular Material por defecto)
- **Tamaños de temperatura:** Display extra-grande para el dato principal

### Animaciones

- Todas las transiciones y animaciones de entrada/salida están implementadas con **GSAP**
- Se usan animaciones tipo reveal, fade, y stagger en listas y dashboards

---

## 4. Pantallas implementadas

Todas las pantallas listadas a continuación están **completamente implementadas** con datos mock:

### 4.1 Allow Location (`/allow-location`)

- Pantalla de bienvenida al primer ingreso
- Fondo de cielo nocturno con estrellas
- Globo terráqueo animado (lado izquierdo) con efecto de radar/ping
- Headline: _"Know your sky, wherever you are."_
- Subtítulo: _"Location Access"_
- Botón: **Allow Location** (con ícono de pin de ubicación)
- Al permitir la ubicación, redirige al dashboard

### 4.2 Onboarding (`/onboarding`)

- Flujo de introducción a las funcionalidades de la app
- Implementada y funcional

### 4.3 Dashboard (`/dashboard`)

- Pantalla principal de la aplicación
- Muestra el clima actual de la ubicación del usuario
- Implementada y funcional

### 4.4 Detail (`/detail`)

- Vista detallada del clima de una ciudad específica
- Información extendida: pronóstico por horas, por días, métricas adicionales
- Implementada y funcional

### 4.5 Favorites (`/favorites`)

- **Acceso rápido** a ciudades guardadas
- Estadísticas en cards superiores:
  - Ciudades guardadas
  - Datos actualizados
  - Ciudades sincronizadas
  - Ciudades en comparación activa
- Lista de **ciudades favoritas** con:
  - Nombre, país y código
  - Temperatura actual (número grande)
  - Descripción del clima (ej. "Mayormente soleado")
  - Sensación térmica, mínima y máxima
  - Humedad, viento y dirección del viento
  - Badge de estado: `SINCRONIZADA` (azul), `LOCAL` (amarillo/dorado)
  - Tiempo transcurrido desde la última actualización
  - Botón para agregar/quitar de comparación
  - Controles para reordenar (arriba/abajo) y eliminar
- Panel lateral **Ciudad activa** con:
  - Nombre y país
  - Temperatura, descripción, sensación
  - Humedad, viento, rango temperatura
  - Botones: "Ver detalle" e "Ir a comparación"
- Botones globales: **Agregar ciudad** y **Comparar**

### 4.6 Search (`/search`)

- Búsqueda de ciudades para agregar a favoritos o consultar
- Implementada y funcional

### 4.7 Profile (`/profile`)

- Perfil del usuario
- Implementada y funcional

### 4.8 Settings (`/settings`)

- Configuración de la aplicación (ej. unidades de temperatura, preferencias)
- Implementada y funcional

---

## 5. Funcionalidades clave

| Funcionalidad                          | Estado                    |
| -------------------------------------- | ------------------------- |
| Geolocalización del navegador          | ✅ Implementado           |
| Lista de ciudades favoritas            | ✅ Implementado           |
| Reordenamiento de favoritos            | ✅ Implementado           |
| Comparación de ciudades                | ✅ Implementado           |
| Sincronización de datos en tiempo real | ✅ Implementado (mock)    |
| Detalle extendido por ciudad           | ✅ Implementado           |
| Búsqueda de ciudades                   | ✅ Implementado           |
| Onboarding                             | ✅ Implementado           |
| Perfil de usuario                      | ✅ Implementado           |
| Configuración                          | ✅ Implementado           |
| Integración real con Open-Meteo API    | 🔲 Pendiente (datos mock) |

---

## 6. Estado del proyecto

- Todas las pantallas y features están **diseñadas e implementadas** visualmente
- Los datos son actualmente **mock** (hardcodeados o simulados)
- El **backend en Express** está iniciado pero la integración con Open-Meteo está pendiente de conectar al frontend
- El siguiente paso lógico es **reemplazar los datos mock** por llamadas reales a la API a través del backend

---

## 7. Notas para colaboración con IA

- El proyecto usa **standalone components** de Angular 19 (sin NgModules clásicos)
- Las rutas están definidas en `app.routes.ts`
- La configuración principal está en `app.config.ts`
- Los tipos globales están en la carpeta `types/`
- La lógica compartida (servicios, pipes, directivas reutilizables) está en `shared/`
- La lógica de negocio central (guards, interceptors, etc.) está en `core/`
- Al sugerir código, respetar el estilo visual existente: glassmorphism, dark theme, Angular Material + GSAP
