import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

// Mantenemos tu función de carga de imágenes igual
export const loadImageBase64 = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error cargando imagen:", url, error);
        return null;
    }
};

export const downloadAppointmentPDF = async (
    appointmentData,
    formulas,
    farmaciaSeleccionada
) => {
    // CONFIGURACIÓN INICIAL
    const pdf = new jsPDF({ unit: "pt", format: "letter" });
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const margin = 40;
    
    // COLORES (Estilo Polpharma)
    const COLORS = {
        primary: [30, 90, 200],   // Azul corporativo
        secondary: [240, 245, 255], // Fondo azul muy claro para cajas
        text: [40, 40, 40],       // Negro suave para lectura
        subtext: [100, 100, 100], // Gris para etiquetas
        white: [255, 255, 255]
    };

    // RECURSOS
    const logoHeader = await loadImageBase64("/img/logo_polpharma.png");
    const marcaAgua = await loadImageBase64("/img/icono_polpharma.png");

    // 1. FONDO Y MARCA DE AGUA
    if (marcaAgua) {
        const tileSize = 150;
        pdf.setGState(new pdf.GState({ opacity: 0.05 })); // Opacidad muy baja para no molestar lectura
        for (let x = 0; x < width; x += tileSize + 60) {
            for (let y = 0; y < height; y += tileSize + 60) {
                pdf.addImage(marcaAgua, "PNG", x, y, tileSize, tileSize);
            }
        }
        pdf.setGState(new pdf.GState({ opacity: 1 }));
    }

    let y = 40; // Cursor vertical inicial

    // 2. ENCABEZADO LIMPIO
    if (logoHeader) {
        // Logo a la izquierda
        const logoW = 160;
        const logoH = 45; 
        pdf.addImage(logoHeader, "PNG", margin, y, logoW, logoH);
    }

    // Título a la derecha alineado con el logo
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(...COLORS.primary);
    pdf.text("Comprobante de Cita", width - margin, y + 30, { align: "right" });
    
    y += 70;

    // Línea separadora moderna
    pdf.setDrawColor(...COLORS.primary);
    pdf.setLineWidth(1);
    pdf.line(margin, y, width - margin, y);
    y += 30;

    // 3. CAJA DESTACADA (FECHA, HORA, TURNO)
    // Esto es lo más importante para el usuario, así que le damos fondo de color
    const boxHeight = 70;
    pdf.setFillColor(...COLORS.secondary);
    pdf.roundedRect(margin, y, width - (margin * 2), boxHeight, 10, 10, "F");

    // Helper para imprimir datos destacados
    const printHighlight = (label, value, xPos) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.subtext);
        pdf.text(label, xPos, y + 25, { align: "center" });

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(...COLORS.primary);
        pdf.text(value, xPos, y + 50, { align: "center" });
    };

    const sectionWidth = (width - margin * 2) / 4;
    printHighlight("FECHA", new Date(appointmentData.day).toLocaleDateString("es-ES"), margin + sectionWidth * 0.5);
    printHighlight("HORA", appointmentData.time ?? appointmentData.hora ?? "--:--", margin + sectionWidth * 1.5);
    printHighlight("TURNO", appointmentData.turnNumber ?? "S/N", margin + sectionWidth * 2.5);
    printHighlight("VENTANILLA", appointmentData.windowNumber ?? "-", margin + sectionWidth * 3.5);

    y += boxHeight + 40;

    // 4. INFORMACIÓN EN DOS COLUMNAS (PACIENTE Y FARMACIA)
    const colWidth = (width - (margin * 3)) / 2;
    const leftColX = margin;
    const rightColX = margin + colWidth + margin; // Margen central

    // Helper para pares Etiqueta: Valor
    const printField = (label, value, x, currentY) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.subtext);
        pdf.text(label.toUpperCase(), x, currentY);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(...COLORS.text);
        // Si el texto es muy largo, lo cortamos o ajustamos (opcional)
        pdf.text(String(value), x, currentY + 15);
        return currentY + 35; // Retorna la nueva Y
    };

    // Columna Izquierda: Paciente
    let yLeft = y;
    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.primary);
    pdf.setFont("helvetica", "bold");
    pdf.text("Información del Paciente", leftColX, yLeft);
    yLeft += 25;
    
    yLeft = printField("Nombre Completo", appointmentData.patientName, leftColX, yLeft);
    yLeft = printField("Documento de Identidad", appointmentData.patientId, leftColX, yLeft);

    // Columna Derecha: Punto de Entrega
    let yRight = y;
    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.primary);
    pdf.setFont("helvetica", "bold");
    pdf.text("Punto de Entrega", rightColX, yRight);
    yRight += 25;

    yRight = printField("Farmacia / Sede", farmaciaSeleccionada?.Name ?? "No asignada", rightColX, yRight);
    yRight = printField("Dirección", farmaciaSeleccionada?.Address ?? "No registrada", rightColX, yRight);

    // Sincronizar Y con la columna más larga
    y = Math.max(yLeft, yRight) + 10;

    // 5. TABLA DE FÓRMULAS
    if (formulas && formulas.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(...COLORS.primary);
        pdf.setFont("helvetica", "bold");
        pdf.text("Medicamentos Solicitados", margin, y);
        y += 15;

        autoTable(pdf, {
            startY: y,
            theme: 'grid', // 'grid' suele ser más limpio que 'striped' para documentos médicos
            headStyles: { 
                fillColor: COLORS.primary, 
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 10,
                textColor: COLORS.text,
                cellPadding: 8
            },
            columnStyles: {
                0: { halign: 'center', fontStyle: 'bold' }, // Código
                1: { cellWidth: 'auto' } // Descripción
            },
            head: [["CÓDIGO", "DETALLE"]],
            body: formulas.map((f) => [
                f.NumeroFormula ?? "N/A",
                `${Array.isArray(f.Medicamentos) ? f.Medicamentos.length : 0} ITEM(S) REGISTRADO(S)`
            ]),
            margin: { left: margin, right: margin },
        });

        // Actualizar Y después de la tabla
        y = pdf.lastAutoTable.finalY + 40;
    } else {
        y += 60; // Espacio si no hay tabla
    }

    // 6. SECCIÓN QR Y PIE DE PÁGINA
    // Verificamos que tengamos espacio, si no, nueva página
    if (y + 150 > height) pdf.addPage();

    const qrData = JSON.stringify({
        id: appointmentData.id,
        paciente: appointmentData.patientId,
        fecha: appointmentData.day,
        turno: appointmentData.turnNumber,
    });

    const qrBase64 = await QRCode.toDataURL(qrData, { margin: 0 }); // Sin margen blanco extra
    
    // Caja contenedora del QR para darle importancia
    const qrBoxY = height - 160;
    const qrSize = 90;
    
    // Texto Call to Action al lado del QR
    pdf.addImage(qrBase64, "PNG", margin, qrBoxY, qrSize, qrSize);
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...COLORS.text);
    pdf.text("Escanea este código al llegar", margin + qrSize + 20, qrBoxY + 35);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.subtext);
    pdf.text("Presenta este comprobante en la ventanilla indicada.", margin + qrSize + 20, qrBoxY + 50);
    pdf.text(`ID Cita: ${appointmentData.id}`, margin + qrSize + 20, qrBoxY + 65);


    // Pie de página final
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(
        "Documento generado automáticamente por Polpharma UT — Válido sin firma física.",
        width / 2,
        height - 20,
        { align: "center" }
    );

    pdf.save(`Cita_${appointmentData.id}.pdf`);
};