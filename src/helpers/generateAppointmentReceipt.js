import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

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

    console.log("DATA ::::: ", formulas);
    const pdf = new jsPDF({ unit: "pt", format: "letter" });
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const margin = 40;

    const COLORS = {
        primary: [30, 90, 200],
        secondary: [240, 245, 255],
        text: [40, 40, 40],
        subtext: [100, 100, 100],
        white: [255, 255, 255]
    };

    const logoHeader = await loadImageBase64("/img/logo_polpharma.png");
    const marcaAgua = await loadImageBase64("/img/icono_polpharma.png");

    if (marcaAgua) {
        const tileSize = 150;
        pdf.setGState(new pdf.GState({ opacity: 0.05 }));
        for (let x = 0; x < width; x += tileSize + 60) {
            for (let y = 0; y < height; y += tileSize + 60) {
                pdf.addImage(marcaAgua, "PNG", x, y, tileSize, tileSize);
            }
        }
        pdf.setGState(new pdf.GState({ opacity: 1 }));
    }

    let y = 40;

    if (logoHeader) {

        const logoW = 240;
        const logoH = 45;
        pdf.addImage(logoHeader, "PNG", margin, y, logoW, logoH);
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(...COLORS.primary);
    pdf.text("Comprobante de Cita", width - margin, y + 30, { align: "right" });

    y += 70;

    pdf.setDrawColor(...COLORS.primary);
    pdf.setLineWidth(1);
    pdf.line(margin, y, width - margin, y);
    y += 30;

    const boxHeight = 70;
    pdf.setFillColor(...COLORS.secondary);
    pdf.roundedRect(margin, y, width - (margin * 2), boxHeight, 10, 10, "F");

    const printHighlight = (label, value, xPos) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.subtext);
        pdf.text(String(label), xPos, y + 25, { align: "center" });

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(...COLORS.primary);
        pdf.text(String(value), xPos, y + 50, { align: "center" });
    };


    const sectionWidth = (width - margin * 2) / 4;
    printHighlight("FECHA", String(new Date(appointmentData.day).toLocaleDateString("es-ES")), margin + sectionWidth * 0.5);
    printHighlight("HORA", String(appointmentData.attentionDateTime ?? appointmentData.processDate ?? "--:--"), margin + sectionWidth * 1.5);
    printHighlight("TURNO", String(appointmentData.turnNumber ?? "S/N"), margin + sectionWidth * 2.5);
    printHighlight("VENTANILLA", String(appointmentData.windowNumber ?? "-"), margin + sectionWidth * 3.5);

    y += boxHeight + 40;

    const colWidth = (width - (margin * 3)) / 2;
    const leftColX = margin;
    const rightColX = margin + colWidth + margin;


    const printField = (label, value, x, currentY) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.subtext);
        pdf.text(label.toUpperCase(), x, currentY);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(...COLORS.text);

        pdf.text(String(value), x, currentY + 15);
        return currentY + 35;
    };


    let yLeft = y;
    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.primary);
    pdf.setFont("helvetica", "bold");
    pdf.text("Información del Paciente", leftColX, yLeft);
    yLeft += 25;

    if (appointmentData.patientName !== "NOMBRE GENERICO") {
        yLeft = printField("Nombre Completo", appointmentData.patientName, leftColX, yLeft);
    }
    yLeft = printField("Documento de Identidad", appointmentData.patientId, leftColX, yLeft);


    let yRight = y;
    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.primary);
    pdf.setFont("helvetica", "bold");
    pdf.text("Punto de Entrega", rightColX, yRight);
    yRight += 25;

    yRight = printField("Farmacia / Sede", farmaciaSeleccionada?.Name ? `${farmaciaSeleccionada?.City} - ${farmaciaSeleccionada?.Name}` : "No asignada", rightColX, yRight);
    yRight = printField("Dirección", farmaciaSeleccionada?.Address ?? "No registrada", rightColX, yRight);


    y = Math.max(yLeft, yRight) + 10;


    if (formulas && formulas.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(...COLORS.primary);
        pdf.setFont("helvetica", "bold");
        pdf.text("Formulas Vigentes", margin, y);
        y += 15;

        autoTable(pdf, {
            startY: y,
            theme: 'grid',
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
                0: { halign: 'center', fontStyle: 'bold' },
                1: { cellWidth: 'auto' }
            },
            head: [["Número de Formula", "Detalle"]],
            body: formulas.map((f) => [
                f.prescription ?? "N/A",
                `${Array.isArray(f.medications) ? f.medications.length : 0} ITEM(S) REGISTRADO(S)`
            ]),
            margin: { left: margin, right: margin },
        });


        y = pdf.lastAutoTable.finalY + 40;
    } else {
        y += 60;
    }



    if (y + 150 > height) pdf.addPage();


    // const qrData = JSON.stringify({
    //     id: appointmentData.id,
    //     paciente: appointmentData.patientId,
    //     fecha: appointmentData.day,
    //     turno: appointmentData.turnNumber,
    // }, null, 2);
    const qrData = `Codigo Cita: ${appointmentData.id}`
    const qrBase64 = await QRCode.toDataURL(qrData, { margin: 0 });


    const qrBoxY = height - 160;
    const qrSize = 90;


    pdf.addImage(qrBase64, "PNG", margin, qrBoxY, qrSize, qrSize);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...COLORS.text);
    pdf.text("Escanea este código al llegar", margin + qrSize + 20, qrBoxY + 42);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.subtext);
    pdf.text("Presenta este comprobante en la ventanilla indicada.", margin + qrSize + 20, qrBoxY + 57);
    //pdf.text(`ID Cita: ${appointmentData.id}`, margin + qrSize + 20, qrBoxY + 65);



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