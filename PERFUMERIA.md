---
project: ELIZANA PERFUMERÍA HAUTE
type: PRD / System Specification
status: Active
architecture: Clean Architecture (React + Tailwind CSS)
design_system: Dark Luxury UI
created_at: 2026-10-20
tags:
  - prd
  - ecommerce
  - react
  - luxury-ui
  - architecture
---

# 👑 PRD: ELIZANA PERFUMERÍA HAUTE

> **Propósito:** Documento de especificación técnica y de diseño maestro para el desarrollo fullstack de la plataforma e-commerce de ultra lujo ELIZANA PERFUMERÍA HAUTE. Diseñado para servir como base de conocimiento y contexto para asistentes IA (Claude, ChatGPT, Cursor).

---

## 🎯 1. Rol & Objetivo del Sistema

- **Rol de IA:** Arquitecto de Software Fullstack Senior y Diseñador Lead UI/UX enfocado en marcas *Haute Parfumerie*.
- **Objetivo:** Proporcionar una arquitectura desacoplada, escalable y mantenible basada en **Clean Architecture**, asegurando cero deuda técnica y una experiencia visual de alto impacto (*Dark Luxury*).

---

## 🎨 2. Sistema de Diseño (Dark Luxury UI)

### Paleta de Colores
- **Fondo Primario:** `#0A0A0C` / `#101014` (Negro carbón profundo).
- **Fondo Secundario (Tarjetas/Paneles):** `#141418` / `#1A1A1E` (Superficie oscura suave).
- **Acentos Dorados (Gold Palette):**
  - Oro Champagne Primario: `#D4AF37`
  - Gradiente Oro: `linear-gradient(135deg, #FFF0B3 0%, #D4AF37 50%, #8C6211 100%)`
  - Borde Sutil: `rgba(212, 175, 55, 0.25)`
- **Tipografía y Textos:**
  - Principal: Blanco Puro (`#FFFFFF`) / Off-White (`#F3F3F5`).
  - Secundario: Gris Cálido (`#9CA3AF`).

### Tipografía
- **Títulos de Marca / Encabezados:** Font Serif de Alta Costura (*Cinzel* o *Playfair Display*).
- **Navegación, Botones y Subtítulos:** Sans-serif moderna en mayúsculas (`Montserrat` o `Inter`), con `letter-spacing: 0.15em` a `0.3em`.

### Elementos Gráficos e Interacciones
- **Bordes:** Finos de `1px` con opacidad dorada refinada.
- **Micro-interacciones:** Transiciones de `300ms ease`, efecto *glow* dorado en `:hover` y animación *Aura Ripple* (onda expansiva dorada) al interactuar con frascos o frascos seleccionados.

---

## 📁 3. Arquitectura de Archivos (Clean Architecture)

```text
elizana-perfumeria/
├── README.md                      # Documentación y guía de instalación
├── package.json                   # Dependencias del proyecto
├── public/                        # Assets estáticos
│   ├── favicon.ico
│   └── assets/
│       ├── brand/                 # Logotipos e isotipo "E"
│       └── products/              # Renders / VECTORES SVG de perfumería
└── src/
    ├── config/                    # Configuración global y tokens de diseño
    │   ├── theme.js               # Colores, fuentes y sombras
    │   └── constants.js           # Constantes del sistema y rutas API
    ├── data/                      # Mocks de datos y modelos
    │   └── mockProducts.js        # Dataset JSON local con pirámide olfativa
    ├── styles/                    # Hojas de estilo globales
    │   ├── globals.css            # Reset y configuración de Tailwind
    │   └── animations.css         # Keyframes y efectos CSS (Aura, Ripple)
    ├── utils/                     # Funciones puras
    │   ├── formatters.js          # Formateo monetario (USD/EUR)
    │   └── auraEffect.js          # Cálculo y renderizado del efecto ripple
    ├── services/                  # Servicios de datos
    │   └── productService.js      # Métodos de consulta, filtro y ordenamiento
    └── components/                # Componentes UI encapsulados
        ├── common/                # Atómicos reutilizables (Button, Badge, Select)
        ├── layout/                # Header, NavigationMenu, Footer
        ├── catalog/               # ControlBar, ProductCard, ProductGrid, OlfactoryPyramid
        └── modals/                # CartDrawer, FilterModal, ProductDetailModal
        
        
        
        
{
  "id": "aura-doree",
  "name": "AURA DORÉE",
  "subtitle": "Eau de Parfum - 100ml",
  "price": 145.00,
  "family": "Oriental",
  "featured": true,
  "olfactoryPyramid": {
    "topNotes": ["Bergamota de Calabria", "Pimienta Rosa"],
    "heartNotes": ["Jazmín Sambac", "Rosa de Grasse"],
    "baseNotes": ["Ámbar Dorado", "Vainilla Bourbon", "Sándalo"]
  }
}



## 🛠️ 5. Funcionalidades Clave del Sistema

1. **Header Haute Performance:**
    
    - Logotipo vectorizado con isotipo circular grabable "E".
        
    - Navegación responsive + Contador flotante dinámico para la bolsa de compras.
        
2. **Barra de Control del Catálogo (`ControlBar`):**
    
    - Acceso a modal de filtros multivariable (Familia olfativa y Rango de Precio).
        
    - Ordenamiento interactivo (_Destacados_, _Menor a Mayor Precio_, _Mayor a Menor Precio_).
        
3. **Tarjeta de Producto Interactive SVG (`ProductCard`):**
    
    - Renderización por código de frasco de cristal ahumado y tapón dorado metálico.
        
    - Botón de exploración directa para abrir la Pirámide Olfativa.
        
4. **Paneles Laterales y Overlays:**
    
    - **Cart Drawer:** Bolsa de compras deslizable con cálculo de subtotal y envío.
        
    - **Product Detail Modal:** Vista detallada mostrando Notas de Salida, Corazón y Fondo.
      
      
      
      
      
      
      
      
      ### 💡 Tips para usarlo en Obsidian con Claude: 1. Copia todo el bloque de arriba y pégalo en tu nota **PERFUMERIA**[cite: 1]. 2. Cuando le pidas cambios a Claude, simplemente puedes adjuntar o referenciar este archivo diciendo: > *"Sigue las especificaciones y reglas definidas en mi documento PRD de PERFUMERIA..."*