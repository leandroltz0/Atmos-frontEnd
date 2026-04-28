ATMOS Weather App — Instructions
Objetivo del Proyecto
Crear una aplicación de clima mobile-first llamada ATMOS usando Angular. La app consume datos de la API gratuita Open-Meteo (sin API key requerida) y utiliza la Geolocation API del navegador para obtener la ubicación del usuario.
API de clima: https://api.open-meteo.com/v1/forecast
API de geocoding: https://geocoding-api.open-meteo.com/v1/search

Estructura de Directorios
src/app/
│
├── core/ # Lógica global (Singletons)
│ ├── services/ # Servicios globales (Auth, API, Theme)
│ ├── interceptors/ # HTTP Interceptors
│ ├── guards/ # Route guards
│ ├── models/ # Interfaces/Types globales
│ └── tokens/ # Injection Tokens
│
├── shared/ # REUTILIZABLE (UI-Kit y utilidades)
│ ├── components/ # Botones, Inputs, Modales (Componentes "tontos")
│ ├── directives/ # Directivas personalizadas (ej: efecto glass)
│ └── pipes/ # Pipes de formato (ej: temp-converter.pipe.ts)
│
├── pages/ # "Smart Components" (Los que definen las rutas)
│ ├── home/ # home.page.ts
│ ├── search/ # search.page.ts
│ └── settings/ # settings.page.ts
│
├── components/ # COMPONENTES ANIDADOS (Lógica de contexto)
│ ├── home/ # Componentes específicos de Home
│ │ ├── home-search/
│ │ └── weather-hero/
│ │
│ ├── search/ # Componentes específicos de Search
│ │ └── city-results/
│ │
│ ├── settings/ # Componentes específicos de Settings
│ │ └── unit-tuner/
│ │
│ └── global/ # Componentes generales pero no genéricos
│ └── navbar/ # El "Floating Dock" innovador
│
├── app.config.ts # Configuración global
├── app.routes.ts # Rutas principales (Lazy loading hacia /pages)
└── app.component.ts # Componente raíz

Recomendación
Si vas a iterar un diseño, usá resources. Cada resource debe tener una imagen de referencia del diseño y el código HTML correspondiente para replicarlo con exactitud.

y TAMBIEN SI VAS A ITERAR UN DISEÑO, USA DATOS MOCK PARA VER COMO QUEDARIA, NUESTRA IDEA ES PODER AGREGARLE FUNCIONALIDADES Y PODER PROBARLAS CON LOS DATOS MOCK. ASI EL DISEÑO QUEDA COMO EL ORIGINAL (LA IMAGEN Y EL CODIGO QUE TE PASE);
