import { db } from "./db";
import { supabase } from "./supabase";

export async function downloadFromSupabase() {
    // Getränke
    const { data, error } = await supabase
        .from("getränke")
        .select("*");

    if (error) {
        console.error(error);
    return;
    }

    // alles lokal speichern
    await db.getränke.bulkPut(data);

    // Kunden
    const { data, error } = await supabase
        .from("kunden")
        .select("*");

    if (error) {
        console.error(error);
    return;
    }

    // alles lokal speichern
    await db.kunden.bulkPut(data);

    // Deckel
    const { data, error } = await supabase
        .from("deckel")
        .select("*");

    if (error) {
        console.error(error);
    return;
    }

    // alles lokal speichern
    await db.deckel.bulkPut(data);


  console.log("Lokale DB aktualisiert");
}