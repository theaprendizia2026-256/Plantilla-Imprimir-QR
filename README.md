# Plantilla QR Cuadrada - Software Architecture & Technical Documentation

Sistema cliente dinámico para la maquetación, renderizado en tiempo real y exportación vectorial de fichas y tarjetas de exhibición gráfica en formato cuadrado rígido. Diseñado bajo una arquitectura ligera *Single-Page Application* (SPA) estática, optimizada para procesamiento de alta fidelidad en lado de cliente (*Client-Side Processing*).

---
<div align="center">
  <img src="https://res.cloudinary.com/deqk2tmer/image/upload/v1786026844/Imprimir_QR_abivba.png" width="250" alt="Captura de la Interfaz">
  <p><i>Interfaz de la WEB.</i></p>
</div>

---

## 1. ESPECIFICACIONES TÉCNICAS Y ARQUITECTURA

- **Motor de Renderizado UI:** HTML5 semántico (`<aside>` / `<main>`), CSS3 Flexbox estricto con distribución axial aislada.
- **Lógica de Dominio:** JavaScript ES6+ (Event-driven paradigm, sin dependencias de frameworks pesados).
- **Procesamiento Gráfico Client-Side:**
  - `QRCode.js`: Generación dinámica de código matriz QR sobre canvas HTML5.
  - `html2canvas v1.4.1`: Captura del árbol DOM (`#card-node`) y conversión a rasterizado de alta densidad pixelar (Scale Factor = 3).
  - `jsPDF v2.5.1`: Compilación e inyección de mapa de bits a documento vectorial PDF con formato cuadrado físico exacto ($10 \times 10\text{ cm}$, $15 \times 15\text{ cm}$, $20 \times 20\text{ cm}$).
- **Tipografías y Assets CDN:**
  - *Cinzel* (Encabezados/Titular) & *Montserrat* (Cuerpo/Instrucciones) vía Google Fonts.
  - Textura de fondo (Canson Paper Engine) servida desde CDN dedicada.

---

## 2. ESTRUCTURA DEL REPOSITORIO

La arquitectura mantiene una jerarquía plana para garantizar la máxima velocidad de ejecución y mínima fricción en el despliegue:

```text
/
├── app.js         # Lógica de reactividad DOM, manipulación de QR y exportación a PDF/WhatsApp
├── index.html     # Estructura semántica, panel de operadores y contenedor Canvas
├── style.css      # Reglas tipográficas, aislamiento de contenedores y diseño adaptativo
├── LICENSE.txt    # Licencia de distribución de código abierto
└── README.md      # Documentación técnica del sistema
