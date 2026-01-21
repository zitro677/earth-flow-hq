import { jsPDF } from "jspdf";

// Updated logo URL to use the new Green Landscape Irrigation tree logo
const logoUrl = "/lovable-uploads/d13d02a7-c0f4-4b0a-828d-cc566f2b3d02.png";

/**
 * Load an image url to dataUrl (base64). This is async but for PDF export, we want users to wait a split second if needed for best logo quality.
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
  const marginLeft = 20;

  // Add green line under header
  doc.setDrawColor(93, 144, 73);
  doc.setLineWidth(1.5);
  doc.line(marginLeft, yPosition - 7, pageWidth - marginLeft, yPosition - 7);

  // Logo configuration
  const logoHeight = 40;
  const logoWidth = 40;
  const logoY = yPosition - 2;
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
    // Continue without logo
  }

  // Company name next to logo - left aligned, shifted right, or centered if logo invisible
  let companyY = yPosition + 10;
  let nameX = logoLoaded ? marginLeft + logoWidth + 10 : pageWidth / 2;
  let align: "left" | "center" | "right" | "justify" = logoLoaded ? "left" : "center";

  doc.setFontSize(18);
  doc.setTextColor(33, 53, 34);
  doc.text("AutoseguroDJ S.A.S", nameX, companyY, { align });

  // Company contact info under name
  companyY += 7;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Teléfono: +57 304 257 61 04    Email: gerencia@autosegurodj.com", nameX, companyY, { align });
  companyY += 5;
  doc.text("Web: www.autosegurodj.com", nameX, companyY, { align });

  // Title centered under logo+company
  companyY += 15;
  doc.setFont(undefined, "bold");
  doc.setFontSize(22);
  doc.setTextColor(93, 144, 73);
  doc.text(title, pageWidth / 2, companyY, { align: "center" });
  // Light line under title
  doc.setDrawColor(222, 232, 222);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 28, companyY + 2, pageWidth / 2 + 28, companyY + 2);

  doc.setTextColor(0, 0, 0);
  return companyY + 12;
};
