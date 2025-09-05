import Dexie from "dexie";

export const db = new Dexie("myLocalDB");
    db.version(1).stores({
        getränke: "++id,bezeichnung,preis",
        kunden: "++id, name, vorname, geburtstag",

});




