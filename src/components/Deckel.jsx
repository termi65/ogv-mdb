import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../utils/db";
import formatNumber from "../utils/formatNumber";

export default function Deckel() {
    const inputRef = useRef(null);
    const navigate = useNavigate();
    // Der Deckel wird anhand der KundenId identifiziert. Dabei können einzelne Positionen anhand der id leicht ermittelt werden.
    const {kundenId} = useParams();
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
        inputRef.current.focus(); 
    },[]);
    
    // Beim Verzehr wird nur hinzugefügt (ein komplett neuer Deckel oder auf dem Deckel ein neues Getränk!).
    const insertDeckel = async () => {
        try {
            if (kundenId != "0") {
                await db.deckel.add({kundenId:parseFloat(kundenId), getränkId: parseFloat(selectedGetränk), anzahl:1});
                
            } else {
                // Falls kein Kunde ausgewählt wurde (mit selecedKunde) wird ein neuer Kunde mit Namen Kunde[N] angelegt, wobei N = max(#unbekannte Kunden)+1
                if (!selectedKunde) {
                    const Unbekannte = await db.kunden.where("name").equals("Kunde").toArray();
                    const ind = Unbekannte.length + 1;
                    const kid = await db.kunden.add({name: "Kunde", vorname: ind.toString(), geburtstag: 0});
                    db.deckel.add({kundenId: kid, getränkId: parseFloat(selectedGetränk), anzahl:1});
                } else
                    await db.deckel.add({kundenId: parseFloat(selectedKunde), getränkId: parseFloat(selectedGetränk), anzahl:1});
            }
        }
        catch(error) {
            console.log(error);
        }
        
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            goBack();
        } 
    };
    
    const goBack = () => {
        navigate("/deckelliste");
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        await insertDeckel();
        navigate('/deckelliste');
        };

    return (
        <div className="container mt-4" onKeyDown={handleKeyDown}>
            <h2 className="text-info bg-dark p-2 text-center">{(kundenId != "0") ? `Deckel von ${kunde.name} , ${kunde.vorname}` : "Neuer Deckel"}</h2>
            <form onSubmit={handleSubmit}>
                {(kundenId != "0")  ? 
                    <div>
                        <p><select ref={inputRef}
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
                        <p><select ref={inputRef}
                                className="form-select bg-secondary"
                                value={selectedKunde}
                                onChange={(e) => setSelectedKunde(e.target.value)}
                                onKeyDown={handleKeyDown}
                            >
                                <option value="">Kunde auswählen (nichts auswählen, falls Kunde unbekannt!)</option>
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
                                onKeyDown={handleKeyDown}
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
                                <button className="w-100 rounded btn btn-primary">
                                    Speichern
                                </button>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-1">
                                <button className="w-100 rounded btn btn-primary" onClick={goBack}>
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