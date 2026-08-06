let qrInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar QR inicial con datos de ejemplo
    const initialUrl = document.getElementById("in-url").value;
    qrInstance = new QRCode(document.getElementById("qr-code"), {
        text: initialUrl,
        width: 220,
        height: 220,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Event Listeners para reactividad en tiempo real
    document.getElementById("in-title").addEventListener("input", updateCard);
    document.getElementById("in-subtitle").addEventListener("input", updateCard);
    document.getElementById("in-quote").addEventListener("input", updateCard);
    document.getElementById("in-url").addEventListener("input", updateQR);

    // Botones de acción
    document.getElementById("btn-pdf").addEventListener("click", exportPDF);
    document.getElementById("btn-ws").addEventListener("click", sendWhatsApp);
});

function updateCard() {
    const titleVal = document.getElementById("in-title").value.trim();
    const subtitleVal = document.getElementById("in-subtitle").value.trim();
    const quoteVal = document.getElementById("in-quote").value.trim();

    document.getElementById("out-title").innerText = titleVal || "EJEMPLO TÍTULO";
    document.getElementById("out-subtitle").innerText = subtitleVal || "EJEMPLO SUBTÍTULO";
    document.getElementById("out-quote").innerText = quoteVal ? `"${quoteVal.replace(/^"|"$/g, '')}"` : '"Ejemplo de frase de cierre..."';
}

function updateQR() {
    const url = document.getElementById("in-url").value.trim();
    if (qrInstance && url !== "") {
        qrInstance.clear();
        qrInstance.makeCode(url);
    }
}

async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const sizeCm = parseFloat(document.getElementById("in-size").value);
    const cardNode = document.getElementById("card-node");

    const canvas = await html2canvas(cardNode, {
        scale: 3,
        useCORS: true,
        allowTaint: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF({
        orientation: 'square',
        unit: 'cm',
        format: [sizeCm, sizeCm]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, sizeCm, sizeCm);
    
    const fileName = `Tarjeta_QR_${sizeCm}x${sizeCm}cm.pdf`;
    pdf.save(fileName);
    return fileName;
}

async function sendWhatsApp() {
    const fileName = await exportPDF();
    const phone = document.getElementById("in-phone").value.replace(/[^0-9]/g, '');
    const sizeCm = document.getElementById("in-size").value;
    const msg = encodeURIComponent(`¡Hola! Te adjunto tu tarjeta lista para imprimir en tamaño exacto (${sizeCm}x${sizeCm} cm).`);
    
    const targetUrl = phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(targetUrl, '_blank');
}
