/**
 * Google Drive Integration
 * Setup: https://console.cloud.google.com → Enable Drive API → OAuth Client ID (Web)
 * Tambahkan VITE_GOOGLE_CLIENT_ID di file .env
 */

const CLIENT_ID  = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const SCOPES     = "https://www.googleapis.com/auth/drive.file";
const FILE_NAME  = "demandpredict-backup.json";

let tokenClient  = null;
let accessToken  = null;

export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) { resolve(); return; }
    const s = document.createElement("script");
    s.src     = "https://accounts.google.com/gsi/client";
    s.onload  = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function requestToken() {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID) { reject(new Error("VITE_GOOGLE_CLIENT_ID belum diset.")); return; }
    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID, scope: SCOPES, callback: () => {},
      });
    }
    tokenClient.callback = (resp) => {
      if (resp.error) { reject(new Error(resp.error)); return; }
      accessToken = resp.access_token;
      resolve(accessToken);
    };
    tokenClient.requestAccessToken({ prompt: "" });
  });
}

async function findFile() {
  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and trashed=false&fields=files(id,modifiedTime)`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const d = await r.json();
  return d.files?.[0] || null;
}

export async function saveToGoogleDrive(dbData) {
  if (!accessToken) await requestToken();
  const blob     = new Blob([JSON.stringify(dbData, null, 2)], { type: "application/json" });
  const existing = await findFile();

  if (existing) {
    const r = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=media`,
      { method: "PATCH", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: blob }
    );
    if (!r.ok) throw new Error(`Gagal update: ${r.status}`);
    return { action: "updated", fileId: existing.id };
  }

  const meta = JSON.stringify({ name: FILE_NAME, mimeType: "application/json" });
  const form = new FormData();
  form.append("metadata", new Blob([meta], { type: "application/json" }));
  form.append("file", blob);
  const r = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body: form }
  );
  if (!r.ok) throw new Error(`Gagal upload: ${r.status}`);
  const result = await r.json();
  return { action: "created", fileId: result.id };
}

export async function loadFromGoogleDrive() {
  if (!accessToken) await requestToken();
  const existing = await findFile();
  if (!existing) throw new Error("File backup tidak ditemukan di Drive.");
  const r = await fetch(
    `https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!r.ok) throw new Error(`Gagal ambil data: ${r.status}`);
  const data = await r.json();
  return { data, modifiedTime: existing.modifiedTime };
}
