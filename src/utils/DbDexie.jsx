import { db } from "./db";

export async function ladeKunden () {
    const kunden = await db.kunden.toArray();
    return kunden;
}

export async function ladeGetränke () {
    const getränke = await db.getränke.toArray();
    return getränke;
}

export async function speichereGetränk (bezeichnung) {
    const response = await db.getränke.insert({bezeichnung:bezeichnung});
    return response;
}

export async function löscheGetränk (id) {
    const response = await db.getränke.delete("id").eq(id);
    return response;
}

export async function ladeDeckel() {
    const deckel = await db.deckel.toArray();
    return deckel;
}

