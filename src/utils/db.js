import Dexie from "dexie";

// Achtung der Deckel wird mit einer KundenId aufgerufen, da sich der Deckel immer mit dem Kunden identifizieren lässt!
export const db = new Dexie("ogv_mdb");
    db.version(1).stores({
        getränke: "++id, bezeichnung, preis",
        kunden: "++id, name, vorname, geburtstag",
        deckel: "++id, kundenId, getränkId, anzahl"
});




