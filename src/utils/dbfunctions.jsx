// 
import * as dex from "./DbDexie";
import * as supab from "./DbSupabase";

const currentDb = import.meta.env.VITE_ACTIVE_DB;

// Wähle die "aktive" Implementierung
const db = currentDb === "indexeddb" ? dex : supab;


// Exportiere einfach alle Funktionen, die beide haben
export const ladeDeckel = db.ladeDeckel;
export const ladeGetränke = db.ladeGetränke;
export const ladeGetränk = db.ladeGetränk;
export const ladeKunden = db.ladeKunden;
export const ladeKunde = db.ladeKunde;
export const ladeKundenMitDeckel = db.ladeKundenMitDeckel;

export const speichereDeckel = db.speichereDeckel;
export const speichereGetränk = db.speichereGetränk;
export const speichereKunde = db.speichereKunde;

export const löscheDeckel = db.löscheDeckel;
export const löscheDeckelGetränk = db.löscheDeckelGetränk;
export const löscheGetränk = db.löscheGetränk;
export const löscheKunde = db.löscheKunde;
// Spezialfunktionen
export const ändereAnzahl = db.ändereAnzahl;
export const deckelMitKundenId = db.deckelMitKundenId;

