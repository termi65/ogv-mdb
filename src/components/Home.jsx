import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user);
        };
        
        checkUser();
        
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => authListener?.subscription.unsubscribe();
    }, []);

    return (
        <div className="container">
            <h1>OGV - Deckelmanager</h1>
            <section>Mit dem Deckelmanager kannst du ohne Deckel und Stift für all deine Kunden einen virtuellen Deckel anlegen.</section>
            <p>Sie sind angemeldet als {user ? `${user.email}` : 'Gast'}</p>
            <h2>Vorsicht!</h2>
            <section>Das Löschen eines Deckels kann nicht rückgängig gemacht werden! Den Kunden also sorgsam abziehen! </section>
        </div>
    )
    
}