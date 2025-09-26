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

// Alle Zeilen des Deckels für den Kunden mit der Id: kid
export async function ladeKundenDeckel (kid) {
    try {
        const { data, error } = await supabase
            .from("deckel")
            .select("*")
            .eq("kundenId", kid)

        if (error) {
            console.error("Fehler beim Laden des Kunden: " + error.message);
            return [];
        }

        return data ?? [];
    } catch (err) {
        console.error("Unerwarteter Fehler:", err);
        return [];
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

export async function speichereDeckel(kundenId, getränkId) {
    const {data, error} = await supabase.from("deckel").insert({kundenId: kundenId, getränkId: getränkId, anzahl: 1});
    return data[0].id;
}

export async function speichereGetränk(id, bezeichnung, preis) {
    if (id === 0) {
       const {data, error} = await supabase.from('getränke').insert({bezeichnung: bezeichnung, preis: preis}).select("id");
       return data[0].id;
    } else {
        await supabase.from('getränke').update({bezeichnung: bezeichnung, preis: preis}).eq("id", id)
        return id;
    }
}

export async function speichereKunde(kundenId, name, vorname, geburtstag) {
    console.log("speichere Kunde");
    try {
        if (kundenId === 0) {
            console.log("einfügen");
            const {data, error} = await supabase.from('kunden').insert({name: name, vorname: vorname, geburtstag: geburtstag}).select("id");
            console.log("data:", data[0].id);
            return data[0].id;
        }
        else {
            console.log("aktualisierenn");
            await supabase.from('kunden').update({name: name, vorname: vorname, geburtstag: geburtstag}).eq("id", kundenId);
        }
    } catch(error) {
        console.log(error.message);
    }
}

export async function löscheDeckel(kundenId) {
    // Erst Kunden des Deckels ermitteln

    const response = await supabase.from('deckel').delete().eq('kundenId',kundenId);
    return response;
}

export async function löscheGetränk(id) {
    const response = await supabase.from('getränke').delete().eq('id',id);
    return response;
}

export async function löscheDeckelGetränk(deckelId, kundenId) {
    const {data, error} = await supabase
        .from("deckel")
        .select("*")
        .eq("kundenId", kundenId);
    // Falls es nur einen Eintrag für diesen Kunden gibt, muss der Deckel gelöscht werden!
    if (data.length === 1) {
        löscheDeckel (kundenId);
    } else {
        await supabase
            .from("deckel")
            .delete()
            .eq("id", deckelId);
    }
}

export async function löscheKunde(id) {
    const response = await supabase.from('kunden').delete().eq('id',id);
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

export async function deckelMitKundenIdExistiert(kundenId) {
    const {data} = await supabase
        .from("deckel")
        .select("*")
        .eq("kundenId", kundenId);
    if (data.length === 0) return false;
    else return true;
}