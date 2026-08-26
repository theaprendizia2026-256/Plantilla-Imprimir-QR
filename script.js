let uploadedLogoSrc = null;

document.addEventListener("DOMContentLoaded", () => {
    renderQR();

    document.getElementById("in-title").addEventListener("input", updateCard);
    document.getElementById("in-subtitle").addEventListener("input", updateCard);
    document.getElementById("in-quote").addEventListener("input", updateCard);
    document.getElementById("in-url").addEventListener("input", renderQR);
    document.getElementById("in-logo").addEventListener("change", handleLogoUpload);
    document.getElementById("in-paper-color").addEventListener("change", updatePaperColor);
    document.getElementById("in-size").addEventListener("change", toggleCustomSizeInput);

    // --- AGREGAR ESTAS DOS LÍNEAS NUEVAS ---
    document.getElementById("in-qr-color").addEventListener("input", renderQR);
    document.getElementById("in-qr-bg").addEventListener("input", renderQR);

    // Escuchar el cambio de estilo de marco y su texto
    document.getElementById("in-frame-style").addEventListener("change", () => {
        toggleFrameTextInput();
        applyFrameStyle();
    });
    document.getElementById("in-frame-text").addEventListener("input", applyFrameStyle);

    document.getElementById("btn-pdf").addEventListener("click", exportPDF);
    document.getElementById("btn-ws").addEventListener("click", sendWhatsApp);

    updatePaperColor();
});

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            uploadedLogoSrc = evt.target.result;
            renderQR();
        };
        reader.readAsDataURL(file);
    } else {
        uploadedLogoSrc = null;
        renderQR();
    }
}

function renderQR() {
    const url = document.getElementById("in-url").value.trim() || "https://instagram.com";

    // Obtenemos los colores seleccionados del input tipo arcoíris
    const qrColor = document.getElementById("in-qr-color") ? document.getElementById("in-qr-color").value : "#000000";
    const qrBg = document.getElementById("in-qr-bg") ? document.getElementById("in-qr-bg").value : "#ffffff";
    
    const qrContainer = document.getElementById("qr-code");
    qrContainer.innerHTML = "";

    // 1. Instanciar el QR con los colores personalizados
    new QRCode(qrContainer, {
        text: url,
        width: 220,
        height: 220,
        colorDark: qrColor,   // Color dinámico de los módulos
        colorLight: qrBg,     // Color dinámico del fondo del QR
        correctLevel: QRCode.CorrectLevel.H
    });

    // 2. Procesar el canvas
    setTimeout(() => {
        const canvas = qrContainer.querySelector("canvas");
        const img = qrContainer.querySelector("img");

        if (canvas) {
            // Aseguramos que el Canvas sea visible y la imagen generada por QRCode.js se oculte
            canvas.style.display = "block";
            if (img) img.style.display = "none";

            if (uploadedLogoSrc) {
                drawLogoOnCanvas(canvas, uploadedLogoSrc);
            }

            // --- AGREGAR ESTA LÍNEA ---
            applyFrameStyle();
        }
    }, 100);
}

function drawLogoOnCanvas(canvas, logoSrc) {
    const ctx = canvas.getContext("2d");
    const logo = new Image();
    logo.src = logoSrc;

    logo.onload = () => {
        const qrSize = canvas.width;
        const logoSize = qrSize * 0.22; // 22% del tamaño total
        const center = (qrSize - logoSize) / 2;

        ctx.save();
        
        // 1. Fondo blanco circular protector
        ctx.beginPath();
        ctx.arc(qrSize / 2, qrSize / 2, (logoSize / 2) + 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // 2. Recorte circular para el logo
        ctx.beginPath();
        ctx.arc(qrSize / 2, qrSize / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // 3. Dibujar la imagen de forma limpia
        ctx.drawImage(logo, center, center, logoSize, logoSize);
        ctx.restore();
    };
}

function updateCard() {
    const titleVal = document.getElementById("in-title").value.trim();
    const subtitleVal = document.getElementById("in-subtitle").value.trim();
    const quoteVal = document.getElementById("in-quote").value.trim();

    document.getElementById("out-title").innerText = titleVal || "TÍTULO / NOMBRE";
    document.getElementById("out-subtitle").innerText = subtitleVal || "SUBTÍTULO / PROFESIÓN";
    document.getElementById("out-quote").innerText = quoteVal ? `"${quoteVal.replace(/^"|"$/g, '')}"` : '"Frase de cierre o instrucción..."';
}

function updatePaperColor() {
    const selectedColor = document.getElementById("in-paper-color").value;
    document.getElementById("card-node").style.backgroundColor = selectedColor;
}

function toggleCustomSizeInput() {
    const sizeSelect = document.getElementById("in-size").value;
    const customGroup = document.getElementById("group-custom-size");
    customGroup.style.display = (sizeSelect === "custom") ? "flex" : "none";
}

function getSelectedSizeCm() {
    const sizeSelect = document.getElementById("in-size").value;
    if (sizeSelect === "custom") {
        const customValue = parseFloat(document.getElementById("in-custom-cm").value);
        return (!isNaN(customValue) && customValue > 0) ? customValue : 10;
    }
    return parseFloat(sizeSelect);
}

async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const sizeCm = getSelectedSizeCm();
    const paperColor = document.getElementById("in-paper-color").value;
    const cardNode = document.getElementById("card-node");

    const canvas = await html2canvas(cardNode, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: paperColor
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: 'letter'
    });

    const pageWidth = 21.59;
    const pageHeight = 27.94;

    const x = (pageWidth - sizeCm) / 2;
    const y = (pageHeight - sizeCm) / 2;

    pdf.addImage(imgData, 'JPEG', x, y, sizeCm, sizeCm);
    
    const fileName = `Tarjeta_QR_${sizeCm}x${sizeCm}cm.pdf`;
    pdf.save(fileName);
    return fileName;
}

async function sendWhatsApp() {
    const fileName = await exportPDF();
    const phone = document.getElementById("in-phone").value.replace(/[^0-9]/g, '');
    const sizeCm = getSelectedSizeCm();
    
    // Mensaje adaptado: notifica la medida y avisa que el archivo va en camino
    const msg = encodeURIComponent(`¡Hola! A continuación te envío tu plantilla QR para imprimir (${sizeCm}x${sizeCm} cm). Adjunto el archivo PDF a continuación...`);
    
    const targetUrl = phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(targetUrl, '_blank');
}

function toggleFrameTextInput() {
    const frameStyle = document.getElementById("in-frame-style").value;
    const textGroup = document.getElementById("group-frame-text");
    textGroup.style.display = (frameStyle === "none") ? "none" : "flex";
}

function applyFrameStyle() {
    const frameStyle = document.getElementById("in-frame-style").value;
    const frameText = document.getElementById("in-frame-text").value.trim() || "SCAN ME";
    const qrWrapper = document.querySelector(".qr-wrapper");
    const qrInstruction = document.querySelector(".qr-instruction");

    // Limpiar clases previas de marcos
    qrWrapper.className = "qr-wrapper frame-" + frameStyle;
    
    // Eliminar etiqueta previa si existía
    const oldTag = qrWrapper.querySelector(".frame-tag");
    if (oldTag) oldTag.remove();

    if (frameStyle !== "none") {
        const tag = document.createElement("div");
        tag.className = "frame-tag";
        tag.innerText = frameText;

        if (frameStyle === "mobile") {
            qrWrapper.insertBefore(tag, qrWrapper.firstChild); // Pone el texto arriba
        } else {
            qrWrapper.appendChild(tag); // Pone el texto abajo
        }
        qrInstruction.style.visibility = "hidden"; // Oculta la instrucción general para usar la del marco
    } else {
        qrInstruction.style.visibility = "visible";
    }
}
