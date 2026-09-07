import "server-only";
import QRCode from "qrcode";

/** Génère un QR code (data URL PNG) pour l'URL donnée. */
export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 480,
    color: {
      dark: "#3E2F23", // brun profond
      light: "#FFFFFF00", // fond transparent
    },
  });
}
