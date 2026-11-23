import "server-only";
import QRCode from "qrcode";

/** Génère un QR code (data URL PNG) pour l'URL donnée. */
export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 4,
    width: 480,
    color: {
      dark: "#43563E", // vert sauge foncé
      light: "#FFFDF8", // ivoire, avec zone calme pour la lecture
    },
  });
}
