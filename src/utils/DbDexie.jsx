import { db } from "./db";

// lädt alle Deckel, Getränke und Kunden
export async function ladeDeckel () {
    const data = await db.deckel.toArray();
    return data;
}

export async function ladeGetränke () {
    const getränke = await db.getränke.toArray();
    return getränke;
}

// Ein einzelnes Getränk!
export async function ladeGetränk (id) {
    const getränk = await db.getränke.where("id").equals(id).first();
    return getränk;
}

export async function ladeKunden () {
    const kunden = await db["kunden"].toArray();
    return kunden;
}

export async function  ladeKunde(id) {
    const kunde = await db
        .kunden
        .where({ id: id })
        .first();
    return kunde;
}

// Wird nur in Abhängigkeit der akutellen Deckelliste dl benötigt
export async function ladeKundenMitDeckel(dl) {
    const alleKunden = await ladeKunden();
    alleKunden.sort((a,b) => {
        const aName = a.name;
        const bName = b.name;
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
    })
    let kmd = [];
    let index = -1;
    alleKunden.map((k) => {
        index = dl.findIndex((el) => el.kundenId === k.id);
        if (index >= 0)
            kmd.push(k);
    })
    return kmd;
}

export async function speichereDeckel(kundenId, getränkId) {
    const response = await db.deckel.insert({kundenId: kundenId, getränkId: getränkId, anzahl: 1});
    return response;
}

export async function speichereGetränk (id, bezeichnung, preis) {
    let response;
    if (id === 0) {
        response = await db.getränke.insert({bezeichnung:bezeichnung, preis: preis});
    } else {
        response = await db.getränke.update(id, {bezeichnung:bezeichnung, preis: preis});
    }
    return response;
}

export async function speichereKunde(id, name, vorname, geburtstag) {
    try {
        if (id != 0) await db.kunden.update(id, {name:name, vorname: vorname, geburtstag: geburtstag})
        else await db.kunden.add({name:name, vorname: vorname, geburtstag: geburtstag})
    }
    catch (error) {
        return error;
    }
}
// Ja dafür brauchen wir die kundenId
export async function löscheDeckel (kundenId) {
    const kunde = await db.kunden.where("id").equals(kundenId).first();
    if (kunde.name==="Kunde"){
        await db.kunden.where("id").equals(kundenId).delete();
    }
    
    const response = await db.deckel
                .where("kundenId")
                .equals(kundenId)
                .delete();
    return response;
}

export async function löscheDeckelGetränk(deckelId, kundenId) {
    const deck = await db.deckel
        .where("kundenId")
        .equals(kundenId).toArray();
    // Falls es nur einen Eintrag für diesen Kunden gibt, muss der Deckel gelöscht werden!
    if (deck.length === 1) {
        await löscheDeckel (kundenId);
    } else {
        await db.deckel
            .where("id")
            .equals(deckelId)
            .delete();
    }
}

export async function löscheGetränk (id) {
    const response = await db.getränke.where("id").equals(id).delete();
    return response;
}    

export async function löscheKunde(kundenId) {
    const response = await db.kunden.where("id").equals(kundenId).delete();
    return response;
}

// Spezialfunktionen
export async function ändereAnzahl(id, anzahl) {
    try {
            const response = await db.deckel.update(id, {anzahl: anzahl});
            return response;
        }
    catch (error) {
            alert("Fehler! " + error);
            return false;
        }
}

export async function deckelMitKundenId(kundenId) {
    const dck = await db.deckel.where("kundenId").equals(kundenId).toArray();
    return dck;
}