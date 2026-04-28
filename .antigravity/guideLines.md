ATMOS Weather App — Guidelines
Prioridades

Trabaja pensando en reutilizar componentes y estilos.
Crea componentes para las tarjetas o cualquier elemento que se repita.
Maneja carpetas y subcarpetas acorde a las páginas que estás trabajando.
No hagas configuraciones ni instalaciones de librerías sin consultar primero.

Paleta de Colores
Modo Oscuro (primario)
UsoValorFondo principal#0F172ASuperficie de cardsrgba(30, 41, 59, 0.45)Borde de cardsrgba(255, 255, 255, 0.06)Acento primario#38BDF8Texto secundario#94A3B8Texto silenciado#475569Separadoresrgba(255, 255, 255, 0.04)Texto blanco#F8FAFC
Modo Claro (secundario)
UsoValorFondo principal#F8FAFCSuperficie de cards#FFFFFF + box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08)Acento primario#0EA5E9Texto principal#1E293BTexto secundario#64748B
Gradientes Dinámicos de Fondo
CondiciónGradienteDespejado / Soleadolinear-gradient(160deg, #1a3a5c, #0F172A)Parcialmente nubladolinear-gradient(160deg, #1a2e4a, #0F172A)Nubladolinear-gradient(160deg, #1a2640, #0F172A)Lluvia / Tormentalinear-gradient(160deg, #1a2030, #0F172A)Nochelinear-gradient(160deg, #0d1b35, #080e1a)Nievelinear-gradient(160deg, #1e2d45, #0F172A)
Escala UV Index
RangoColorLabelUV 0–2#22C55ELowUV 3–5#EAB308ModerateUV 6–7#F97316HighUV 8–10#EF4444Very HighUV 11+#9333EAExtreme

Tipografía
Dos fuentes únicamente: Outfit e Inter.

Outfit → números, headlines, temperatura hero.
Inter → texto informativo, labels, descripciones, captions.

ElementoFuenteTamañoPesoTemperatura heroOutfit96–112pxBlack (900)Símbolo de grado °Outfit32pxBlack — superscriptHeadline de pantallaOutfit28pxBold (700)Nombre de ciudadOutfit20pxSemiBold (600)Valor grande en cardOutfit32–38pxSemiBold (600)Label de secciónInter15pxMedium (500)Texto de cuerpoInter13pxRegular (400)Caption / timestampInter11pxRegular (400)Encabezado de secciónInter10pxMedium (500) — UPPERCASE + letter-spacing: 0.15em

Estructura UI
Glassmorphism (todas las cards)
background: rgba(30, 41, 59, 0.45)
backdrop-filter: blur(20px)
border: 0.5px solid rgba(255, 255, 255, 0.06)
border-radius: 20px (cards grandes) / 14px (cards pequeñas / chips)
padding: 20px (grandes) / 12px (pequeñas)
Espaciado

Padding horizontal de pantalla: 20px — el contenido nunca toca los bordes.
Elementos relacionados: espaciado ajustado 8–12px.
Secciones distintas: espaciado generoso 24–40px.
Después de la temperatura hero: mínimo 40px.

Bottom Navbar

5 tabs: Home · Forecast · Search · My Cities · Settings.
Pill flotante: margin: 0 20px 24px 20px.
Tab activo: ícono #38BDF8 + pill background rgba(56,189,248,0.12) + scale(1.1).
Tab inactivo: ícono #475569.
Todos los íconos: mismo set, mismo stroke 1.5px, 24px.

Header
Tres variantes según la pantalla:

Variant A (Home, My Cities, Settings): ≡ izquierda · título centro · 📍 derecha.
Variant B (Forecast, Hourly Detail): ← izquierda · título centro · 📍 derecha.
Variant C (City Search): ≡ izquierda · wordmark "ATMOS" centro.

El título del header es siempre #F8FAFC — nunca en color acento.
