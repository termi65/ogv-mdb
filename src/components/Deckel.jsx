import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../db";
import formatNumber from "../utils/formatNumber";

export default function Deckel() {
    const navigate = useNavigate();
    // Der Deckel wird anhand der KundenId identifiziert. Dabei können einzelne Positionen anhand der id leicht ermittelt werden.
    const {kundenId} = useParams();
    const [deckelId, setDeckellisteId] = useState(0);
    // const [deckelliste, setDeckelliste] = useState([]);
    const [selectedKunde, setSelectedKunde] = useState(null);
    const [kundenliste, setKundenliste] = useState([]);
    const [kunde, setKunde] = useState({name:'', vorname: '', geburtstag: ''});
    const [getränkeliste, setGetränkeliste] = useState([]);
    const [selectedGetränk, setSelectedGetränk] = useState([]);
    
    const ladeKunden = async(d) => {
        const k = await db.kunden.toArray();
        const kundenOhneDeckel = k.filter(kunde =>
            !d.some(deckel => deckel.kundenId === kunde.id)
        );
        setKundenliste(kundenOhneDeckel);
    }

    const ladeGetränke = async(d) => {
        const g = await db.getränke.toArray();
        const getränkeNichtAufDeckel = g.filter(getränk =>
            !d.some(deckel => deckel.getränkId === getränk.id)
        );
        setGetränkeliste(getränkeNichtAufDeckel);
    }

    // Hier brauch ich keine Kundenliste nur den Kunden.
    const ladeDeckel = async (kid) => {
        const d = await db.deckel.where("kundenId").equals(kid).toArray();
        const k = await db.kunden.where("id").equals(kid).first();
        setKunde(k);
        const g = await db.getränke.toArray();
        await ladeGetränke(d);

    }

    const ladeDatenFürNeuenDeckel = async () => {
        const d = await db.deckel.toArray();
        await ladeKunden(d);
        const g = await db.getränke.toArray();
        setGetränkeliste(g);
    }

    useEffect(() => {
        if (kundenId != "0") {
            ladeDeckel(parseFloat(kundenId));
        } else {
            ladeDatenFürNeuenDeckel();
        }
    },[]);
    
    // Beim Verzehr wird nur hinzugefügt (ein komplett neuer Deckel oder auf dem Deckel ein neues Getränk!).
    const insertDeckel = async () => {
        try {
            if (kundenId != "0") {
                await db.deckel.add({kundenId:parseFloat(kundenId), getränkId: parseFloat(selectedGetränk), anzahl:1});
                
            } else {
                await db.deckel.add({kundenId: parseFloat(selectedKunde), getränkId: parseFloat(selectedGetränk), anzahl:1});
            }
        }
        catch(error) {
            console.log(error);
        }
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await insertDeckel();
        navigate('/deckelliste');
        };

    return (
        <div className="container mt-4">
            <h2>{(kundenId != "0") ? `Deckel von ${kunde.name} , ${kunde.vorname}` : "Neuer Deckel"}</h2>
            <form onSubmit={handleSubmit}>
                {(kundenId != "0")  ? 
                    <div>
                        <p><select
                                className="form-select bg-secondary"
                                required
                                value={selectedGetränk}
                                onChange={(e) => setSelectedGetränk(e.target.value)}
                            >
                                <option value="">Getränk auswählen</option>
                                {getränkeliste.map((g) => (
                                    <option className="bg-info" key={g.id} value={g.id}>
                                        {g.bezeichnung} {formatNumber(g.preis)} €
                                    </option>
                                ))}
                            </select>
                        </p>
                    </div>
                    :
                    <div>
                        <p><select
                                className="form-select bg-secondary"
                                required
                                value={selectedKunde}
                                onChange={(e) => setSelectedKunde(e.target.value)}
                            >
                                <option value="">Kunde auswählen</option>
                                {kundenliste.map((m) => (
                                    <option className="bg-info" key={m.id} value={m.id}>
                                        {m.name} {m.vorname}
                                    </option>
                                ))}
                            </select>
                        </p>
                        <p><select
                                className="form-select bg-secondary"
                                required
                                value={selectedGetränk}
                                onChange={(e) => setSelectedGetränk(e.target.value)}
                            >
                                <option value="">Getränk auswählen</option>
                                {getränkeliste.map((g) => (
                                    <option className="bg-info" key={g.id} value={g.id}>
                                        {g.bezeichnung} {formatNumber(g.preis)} €
                                    </option>
                                ))}
                            </select>
                        </p>
                    </div>
                }
                <div className="container text-center">
                    <div className="row gx-1">
                        <div className="col">
                            <div className="p-1">
                                <button type="submit" className="w-100 rounded btn btn-primary">
                                    Speichern
                                </button>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-1">
                                <button className="w-100 rounded btn btn-primary" onClick={() => navigate("/deckelliste")}>
                                    Abbrechen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}