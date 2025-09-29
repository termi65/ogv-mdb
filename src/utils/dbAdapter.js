import * as dex from "./DbDexie";
import * as supab from "./DbSupabase";

export function getDb(actDb) {
    return actDb === "indexeddb" ? dex : supab;
}