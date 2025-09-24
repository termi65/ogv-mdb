import supabase from "./supabase";


export async function ladeDaten(tabelle, orderby) {
    try {
        const { data, error } = await supabase
        .from(tabelle)
        .select("*")
        .order(orderby, {ascending: true});

        if (error) {
            console.error("Fehler beim Laden der " + {tabelle} + ":", error.message);
        return [];
        }

        return data ?? [];
    } catch (err) {
        console.error("Unerwarteter Fehler:", err);
        return [];
    }
}

export async function ladeDeckel () {
    return ladeDaten("deckel", "kundenId");
}

export async function ladeGetränke () {
    return ladeDaten("getränke", "bezeichnung");
}

export async function ladeGetränk(id) {
    try {
        const { data, error } = await supabase
            .from("getränke")
            .select("*")
            .eq("id", id)
        if (error) {
            console.log("Fehler:" + error.message);
            return null;
        }
        return data[0] ?? null;
    } catch (error) {
        console.log("Unerwarteter Fehler:", error);
    }
}

export async function ladeKunden () {
    return ladeDaten("kunden", "name");
}

export async function ladeKunde (id) {
    try {
        const { data, error } = await supabase
        .from("kunden")
        .select("*")
        .eq("id", id)

        if (error) {
            console.error("Fehler beim Laden des Kunden: " + error.message);
            return null;
        }

        return data[0] ?? null;
    } catch (err) {
        console.error("Unerwarteter Fehler:", err);
        return null;
    }
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

export async function speichereDeckel(kundenId, getränkeId) {
    const res = await supabase.from("deckel").insert({kundenId: kundenId, getränkeId: getränkeId});
    return res;
}

export async function speichereGetränk(id, bezeichnung, preis) {
    id === 0 
        ? await supabase.from('getränke').insert({bezeichnung: bezeichnung, preis: preis})
        : await supabase.from('getränke').update({bezeichnung: bezeichnung, preis: preis}).eq(id, id);
}

export async function speichereKunde(kundenId, name, vorname, geburstag) {
    kundenId === 0 
        ? await supabase.from('kunden').insert({name: name, vorname: vorname, geburstag: geburstag ?? null})
        : await supabase.from('kunden').update({name: name, vorname: vorname, geburstag: geburstag ?? null}).eq(id, id);
}

export async function löscheDeckel(kundenId) {
    const response = await supabase.from('deckel').delete.eq('kundenId',kundenId);
    return response;
}

export async function löscheGetränk(id) {
    const response = await supabase.from('getränke').delete.eq('id',id);
    return response;
}

export async function löscheDeckelGetränk(deckelId, kundenId) {
    const {data, error} = await supabase
        .from("deckel")
        .eq("kundenId", kundenId);
    // Falls es nur einen Eintrag für diesen Kunden gibt, muss der Deckel gelöscht werden!
    if (data.length === 1) {
        löscheDeckel (kundenId);
    } else {
        await supabase
            .from("deckel")
            .delete
            .eq("id", deckelId);
    }
}

export async function löscheKunden(id) {
    const response = await supabase.from('kunden').delete.eq('id',id);
    return response;
}

// Spezialfunktionen
export async function ändereAnzahl(id, anzahl) {
    try {
        const response = await supabase.from("deckel").update({anzahl: anzahl}).eq("id", id);
        return response;
    }
    catch (error) {
        alert("Fehler! " + error);
        return false;
    }
}

export async function deckelMitKundenId(kundenId) {
    const {data} = await supabase
        .from("kunden")
        .where({kundenId: kundenId});
    return data;
}