import React, { createContext, useContext, useState, useEffect } from "react";

const DbContext = createContext();

export function DbProvider({ children }) {
    // Lade den Wert aus localStorage oder nimm "indexeddb" als Default
    const [actDb, setActDb] = useState(() => {
        return localStorage.getItem("actDb") || "indexeddb";
    });

    // Jedes Mal wenn actDb sich ändert → auch in localStorage speichern
    useEffect(() => {
        localStorage.setItem("actDb", actDb);
    }, [actDb]);

    return (
        <DbContext.Provider value={{ actDb, setActDb }}>
        {children}
        </DbContext.Provider>
    );
}

export function useDb() {
    return useContext(DbContext);
}
