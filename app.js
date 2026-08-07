let qrInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar QR
    const initialUrl = document.getElementById("in-url").value.trim() || "https://instagram.com";
    qrInstance = new QRCode(document.getElementById("qr-code"), {
        text: initialUrl,
        width: 220,
        height: 220,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Escuchadores de eventos para actualización reactiva
    document.getElementById("in-title").addEventListener("input", updateCard);
    document.getElementById("in-subtitle").addEventListener("input", updateCard);
    document.getElementById("in-quote").addEventListener("input", updateCard);
    document.getElementById("in-url").addEventListener("input", updateQR);

    // Cambio de Tono de Papel
    document.getElementById("in-paper-color").addEventListener("change", updatePaperColor);

    // Selector de Tamaño Personalizado
    document.getElementById("in-size").addEventListener("change", toggleCustomSizeInput);

    // Botones de acción
    document.getElementById("btn-pdf").addEventListener("click", exportPDF);
    document.getElementById("btn-ws").addEventListener("click", sendWhatsApp);

    // Inicializar color de papel
    updatePaperColor();
});

function updateCard() {
    const titleVal = document.getElementById("in-title").value.trim();
    const subtitleVal = document.getElementById("in-subtitle").value.trim();
    const quoteVal = document.getElementById("in-quote").value.trim();

    document.getElementById("out-title").innerText = titleVal || "TÍTULO / NOMBRE";
    document.getElementById("out-subtitle").innerText = subtitleVal || "SUBTÍTULO / PROFESIÓN";
    document.getElementById("out-quote").innerText = quoteVal ? `"${quoteVal.replace(/^"|"$/g, '')}"` : '"Frase de cierre o instrucción..."';
}

function updateQR() {
    const url = document.getElementById("in-url").value.trim();
    if (qrInstance && url !== "") {
        qrInstance.clear();
        qrInstance.makeCode(url);
    }
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

    // Capture con fondo sólido
    const canvas = await html2canvas(cardNode, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: paperColor
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    // Creamos la hoja en formato Estándar Carta/A4 (o hoja de imprenta)
    // Para que la tarjeta quede perfectamente centrada en la hoja
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: 'letter' // Hoja Carta estándar para imprenta/casa
    });

    // Dimensiones de hoja Carta en cm
    const pageWidth = 21.59;
    const pageHeight = 27.94;

    // Cálculo del centro exacto
    const x = (pageWidth - sizeCm) / 2;
    const y = (pageHeight - sizeCm) / 2;

    // Dibujamos la tarjeta centrada con su tamaño exacto
    pdf.addImage(imgData, 'JPEG', x, y, sizeCm, sizeCm);
    
    const fileName = `Tarjeta_QR_${sizeCm}x${sizeCm}cm.pdf`;
    pdf.save(fileName);
    return fileName;
}

async function sendWhatsApp() {
    const fileName = await exportPDF();
    const phone = document.getElementById("in-phone").value.replace(/[^0-9]/g, '');
    const sizeCm = getSelectedSizeCm();
    const msg = encodeURIComponent(`¡Hola! Te adjunto tu tarjeta lista para imprimir en tamaño exacto (${sizeCm}x${sizeCm} cm).`);
    
    const targetUrl = phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(targetUrl, '_blank');
}
