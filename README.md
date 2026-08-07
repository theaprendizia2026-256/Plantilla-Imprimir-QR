# Plantilla QR Cuadrada - Software Architecture & Technical Documentation

Sistema cliente dinámico para la maquetación, renderizado en tiempo real y exportación de fichas y tarjetas de exhibición gráfica en formato cuadrado rígido. Diseñado bajo una arquitectura *Single-Page Application* (SPA) estática de cero dependencias pesadas (*Vanilla Web Tech*), optimizada para procesamiento de alta fidelidad en lado del cliente (*Client-Side Processing*).

---

<div align="center">
  <img src="https://res.cloudinary.com/deqk2tmer/image/upload/v1786026844/Imprimir_QR_abivba.png" width="350" alt="Captura de la Interfaz">
  <p><i>Interfaz del Generador de Tarjetas QR.</i></p>
</div>

---

## 1. ESPECIFICACIONES TÉCNICAS Y ARQUITECTURA

- **Motor de Renderizado UI:** HTML5 semántico (`<aside>` para control de parámetros, `<main>` para vista previa), CSS3 Flexbox estricto con distribución de contenedores aislada.
- **Lógica de Dominio:** JavaScript ES6+ basado en eventos (`DOMContentLoaded`, `input`, `change`), sin frameworks para garantizar ejecución inmediata e inmunidad al paso del tiempo.
- **Procesamiento Gráfico & Canvas Client-Side:**
  - `QRCode.js`: Generación dinámica de la matriz QR sobre `<canvas>`.
  - **Incrustación de Logo Vectorial/Ráster:** Manipulación del contexto 2D del canvas para inyectar un logo central sobre una máscara circular protectora limpia.
  - `html2canvas v1.4.1`: Rasterizado del árbol DOM (`#card-node`) a alta densidad de píxeles (`scale: 3`, `useCORS: true`).
  - `jsPDF v2.5.1`: Compilación e inyección de mapa de bits en un documento PDF normalizado (formato Carta) centrado milimétricamente en tiempo de ejecución.

---

## 2. NUEVOS MÓDULOS Y FUNCIONALIDADES

### A. Módulo de Tonos de Papel (Canson Paper Engine)
Para evitar bloqueos de origen cruzado (CORS) y asegurar la representación limpia del color en la exportación, el fondo del lienzo opera con **colores sólidos nativos** en lugar de imágenes externas:
- **Crema Marfil (`#f7f5f0`):** Clásico texturado.
- **Blanco Puro (`#ffffff`):** Técnico y minimalista.
- **Gris Cálido (`#e8e4d9`):** Estilo industrial.
- **Arena Suave (`#f0eae1`):** Tono orgánico.

### B. Dinámica de Tamaños (Estándar y Personalizado)
El selector de dimensión calcula en tiempo real las proporciones físicas de salida:
- **Preset Fijos:** $10 \times 10\text{ cm}$, $15 \times 15\text{ cm}$ y $20 \times 20\text{ cm}$.
- **Modo Personalizado (`custom`):** Despliega dinámicamente un campo de entrada numérico que permite definir medidas milimétricas específicas (ej: $12.5\text{ cm}$).

### C. Integración con WhatsApp API (Direct Communication)
Atajo de comunicación directa mediante protocolo `wa.me` que elimina la fricción operacional de guardar contactos en la agenda:
- Descarga automáticamente el PDF en la resolución seleccionada.
- Abre un canal directo con el número ingresado.
- Pre-redacta un mensaje de cortesía indicando al cliente que la plantilla va en camino y especificando sus dimensiones exactas para impresión.

---

## 3. ESTRUCTURA DEL REPOSITORIO

```text
/
├── app.js         # Lógica de reactividad DOM, renderizado en Canvas y exportación a PDF/WhatsApp
├── index.html     # Estructura semántica, panel de control de operador y lienzo de vista previa
├── style.css      # Reglas tipográficas, paleta oscura de interfaz y contención de layout
├── LICENSE.txt    # Licencia de distribución de código abierto
└── README.md      # Documentación técnica del sistema
