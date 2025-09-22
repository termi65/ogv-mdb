// 
import * as dex from "./DbDexie";
import * as supab from "./DbSupabase";

const currentDb = import.meta.env.VITE_ACTIVE_DB;

// Wähle die "aktive" Implementierung
const db = currentDb === "indexeddb" ? dex : supab;


// Exportiere einfach alle Funktionen, die beide haben
export const ladeGetränke = db.ladeGetränke;
export const speichereGetränk = db.speichereGetränk;
export const löscheGetränk = db.löscheGetränk;
// ... hier beliebig viele weitere Funktionen

export const ladeKunden = db.ladeKunden;
