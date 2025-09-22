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

export async function ladeKunden () {
    return ladeDaten("kunden", "name");
}

export async function speichereGetränk(bezeichnung, id) {
    id === 0 ? await supabase.from('getränke').insert({bezeichnung: bezeichnung}) : await supabase.from('getränke').update({bezeichnung:bezeichnung}).eq(id, id);
}

export async function löscheGetränk(id) {
    const response = await supabase.from('getränke').delete.eq('id',id);
    return response;
}






