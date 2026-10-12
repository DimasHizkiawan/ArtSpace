// src/lib/local/image.ts
// Memperkecil gambar sebelum disimpan di localStorage (kuotanya hanya sekitar 5 MB).
const MAX_SIDE = 1400;
const QUALITY = 0.82;
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const AVATAR_SIDE = 256;

export type ProcessedImage = { dataUrl: string; width: number; height: number };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("File gambar tidak bisa dibaca. Coba file lain."));
    };
    img.src = url;
  });
}

function checkFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Hanya file gambar yang diterima (JPG, PNG, atau WebP).");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Ukuran file lebih dari 10 MB. Pilih gambar yang lebih kecil.");
  }
}

function newCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser ini tidak mendukung pemrosesan gambar.");
  ctx.fillStyle = "#ffffff"; // PNG transparan jadi berlatar putih
  ctx.fillRect(0, 0, width, height);
  return { canvas, ctx };
}

/** Melempar Error berisi pesan yang siap ditampilkan ke pengguna. */
export async function processImage(file: File): Promise<ProcessedImage> {
  checkFile(file);
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const { canvas, ctx } = newCanvas(width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return { dataUrl: canvas.toDataURL("image/jpeg", QUALITY), width, height };
}

/** Foto profil: dipotong persegi dari tengah, 256 px. Hasilnya hanya belasan KB. */
export async function processAvatar(file: File): Promise<string> {
  checkFile(file);
  const img = await loadImage(file);
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;

  const { canvas, ctx } = newCanvas(AVATAR_SIDE, AVATAR_SIDE);
  ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIDE, AVATAR_SIDE);
  return canvas.toDataURL("image/jpeg", 0.85);
}