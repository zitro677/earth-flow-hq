import { jsPDF } from "jspdf";

// AutoseguroDJ S.A.S logo
const logoUrl = "/lovable-uploads/autoseguro-dj-logo.png";

// Brand colors
const BRAND_GREEN = { r: 21, g: 128, b: 61 }; // #15803d
const BRAND_GREEN_LIGHT = { r: 220, g: 252, b: 231 }; // #dcfce7

/**
 * Load an image url to dataUrl (base64)
 */
const getImageDataUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = function (err) {
      reject(err);
    };
    img.src = url;
  });
};

export const addHeaderSection = async (doc: jsPDF, title: string, yPositionInitial: number, pageWidth: number) => {
  let yPosition = yPositionInitial;
  const marginLeft = 15;
  const marginRight = 15;

  // Header background bar
  doc.setFillColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Logo configuration
  const logoHeight = 28;
  const logoWidth = 28;
  const logoY = yPosition - 5;
  const logoX = marginLeft;
  let logoLoaded = false;

  // Try to load and add logo
  try {
    const logoBase64 = await getImageDataUrl(logoUrl);
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      logoLoaded = true;
    }
  } catch (error) {
    console.warn("Failed to load logo for PDF:", error);
  }

  // Company name - next to logo
  let nameX = logoLoaded ? marginLeft + logoWidth + 6 : marginLeft;
  let companyY = yPosition + 5;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.setTextColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.text("AUTOSEGURODJ S.A.S", nameX, companyY);

  // Company tagline
  companyY += 5;
  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Blindaje y Seguridad Vehicular", nameX, companyY);

  // Contact info on the right
  const contactX = pageWidth - marginRight;
  let contactY = yPosition + 2;
  
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text("Tel: +57 304 257 61 04", contactX, contactY, { align: "right" });
  contactY += 4;
  doc.text("gerencia@autosegurodj.com", contactX, contactY, { align: "right" });
  contactY += 4;
  doc.text("www.autosegurodj.com", contactX, contactY, { align: "right" });

  // Divider line
  companyY += 10;
  doc.setDrawColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.setLineWidth(0.5);
  doc.line(marginLeft, companyY, pageWidth - marginRight, companyY);

  // Main title centered
  companyY += 12;
  doc.setFont(undefined, "bold");
  doc.setFontSize(20);
  doc.setTextColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.text(title, pageWidth / 2, companyY, { align: "center" });

  doc.setTextColor(0, 0, 0);
  return companyY + 10;
};
