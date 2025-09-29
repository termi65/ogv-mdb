import { getDb } from "./dbAdapter";

// const actDb = import.meta.env.VITE_ACTIVE_DB;

// Exportiere einfach alle Funktionen, die beide haben
export const ladeDeckel = getDb().ladeDeckel;
export const ladeGetränke = getDb().ladeGetränke;
export const ladeGetränk = getDb().ladeGetränk;
export const ladeKunden = getDb().ladeKunden;
export const ladeKunde = getDb().ladeKunde;
export const ladeKundenMitDeckel = getDb().ladeKundenMitDeckel;
export const ladeKundenDeckel = getDb().ladeKundenDeckel;

export const speichereDeckel = getDb().speichereDeckel;
export const speichereGetränk = getDb().speichereGetränk;
export const speichereKunde = getDb().speichereKunde;

export const löscheDeckel = getDb().löscheDeckel;
export const löscheDeckelGetränk = getDb().löscheDeckelGetränk;
export const löscheGetränk = getDb().löscheGetränk;
export const löscheKunde = getDb().löscheKunde;
// Spezialfunktionen
export const ändereAnzahl = getDb().ändereAnzahl;
export const deckelMitKundenIdExistiert = getDb().deckelMitKundenIdExistiert;

export const deckelMitGetränkIdExistiert = getDb().deckelMitGetränkIdExistiert;
