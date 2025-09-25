// ToDo:
//      1) Einen neuen Deckel mit einem unbekannten Kunden aufnehmen evtl. mit Bild?
//      2) Die Animation beim Inkrementieren und Dekrementieren wird bei allen Kunden angezeigt. Das muss auf eine Zeile begrenzt werden!

import { useEffect, useRef, useState } from "react";
import useScreenSize from "../utils/useScreenSize";
import Dialog from "./Dialog";
import { useNavigate } from "react-router-dom";
import formatNumber from "../utils/formatNumber";
import * as mdb from "../utils/dbfunctions";

const Deckelliste = () => {
    const screenSize = useScreenSize();
    const navigate = useNavigate();
    const geladen = useRef(false);
    
    // Für die modalen Dialog relevanten Variablen
    const [showModalDeckel, setShowModalDeckel] = useState(false);
    const [showModalEintrag, setShowModalEintrag] = useState(false);
    const [deckelliste, setDeckelliste] = useState([]);
    const [kundenMitDeckel, setKundenMitDeckel] = useState([]);
    const [currentKundenId, setCurrentKundenId] = useState(0);
    const [currentDeckelId, setCurrentDeckelId] = useState(0);
    const [animationStates, setAnimationStates] = useState({});

    // wir triggern nur den Eintrag mit der übergebenen ID
    const triggerAnimation = (id, operator) =>{
        setAnimationStates((prev) => ({
            ...prev,
            [id]: operator === "plus" ? "animateTextColor" : "animateTextColorMinus",
        }));

        setTimeout(() => {
            setAnimationStates((prev) => ({
                ...prev,
                [id]: operator === "plus" ? "animateTextColor active" : "animateTextColorMinus active",
            }));
        }, 20);
    }

    // Funktionen
    const berechneGesamtsummeKunde = (kid) => {
        const filteredvl = deckelliste.filter((dck) => dck.kundenId === kid);
        return filteredvl.reduce((sum, vl) => sum + vl.preis * vl.anzahl, 0);
    }

    const incGetränk = async (id, anzahl) => {
        await mdb.ändereAnzahl(id, anzahl+1);
        await ladeDaten();
        triggerAnimation(id, 'plus');
    }

    const decGetränk = async (id, anzahl) => {
        await mdb.ändereAnzahl(id, anzahl-1);
        await ladeDaten();
        triggerAnimation(id, 'minus');
    }

    const deleteDeckel = async () => {
        await mdb.löscheDeckel(currentKundenId);
        ladeDaten();
        
    }

    const delGetränk = async () => {
        try {
            await mdb.löscheDeckelGetränk(currentDeckelId, currentKundenId);
        }
        catch (error) {
            alert("Fehler! " + error);
        }
    }

    const ladeDaten = async () => {
        const dl = await mdb.ladeDeckel();
        const kl = await mdb.ladeKundenMitDeckel(dl);
        const gl = await mdb.ladeGetränke();
        
        const dlMitNamen = dl.map(eintrag => {
            // Den Kunden ermitteln
            const kunde = kl.find(k => k.id === eintrag.kundenId);
            // ich brauch für diesen Deckel alle Getränke nicht nur einen!
            const getränk = gl.find(g => g.id === eintrag.getränkId);
            return {
                ...eintrag,
                kundenName: kunde ? kunde.name + ' ' + kunde.vorname: "Unbekannt",
                getränkName: getränk ? getränk.bezeichnung : "Unbekannt",
                preis: getränk ? getränk.preis : 0
            };
        });
        setDeckelliste(dlMitNamen);
        setKundenMitDeckel(kl);
    };

    useEffect(() => {
        if (geladen.current) return;
        ladeDaten();
    },[]);

    return (
        <div className="container mt-4">
            <h2 className="text-info bg-dark p-2 text-center">Deckelsammlung 
                <button type="button" className="ms-2 p-2 btn btn-primary" onClick={() => navigate(`/deckel/0`)}>
                    <i className="bi bi-cart-plus"></i>
                </button>
            </h2>
            <hr />
            {
                kundenMitDeckel.map((k) => {
                    return (
                        <div key={k.id} className="mt-2">
                            <p className="">{k.name} {k.vorname}
                                <button className="ms-2 btn border-primary rounded" onClick={() => navigate(`/deckel/${k.id}`)}>+</button>
                            </p>
                            <table className="table table-bordered mt-2 border-primary p-1">
                                <thead>
                                    <tr>
                                        <th>Artikel</th>
                                        <th className="text-center">#</th>
                                        <th className="text-end">€</th>
                                        <th className="text-end">∑ (€)</th>
                                        <th className="text-center">+1</th>
                                        <th className="text-center">-1</th>
                                        <th className="text-center">
                                            {(screenSize ==="sm" || screenSize ==="xs" ) ? 
                                                <i className="bi bi-x-square"></i> 
                                                : 
                                                <span>Löschen</span>}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deckelliste.filter((dck) => dck.kundenId === k.id).map((d) => {
                                        const classOfNumber = animationStates[d.id] || "";
                                        return (
                                            <tr key={d.id} className="p-2 border-b">
                                                <td>{d.getränkName}</td> 
                                                {d.anzahl >= 0 ? 
                                                    <>
                                                        <td className="text-center">{d.anzahl}</td>
                                                        <td className="text-end">{formatNumber(d.preis) }</td>
                                                        <td className="text-end">
                                                            <div className={classOfNumber}>
                                                                {formatNumber(d.preis * d.anzahl)}
                                                            </div>
                                                        </td>
                                                    </> 
                                                    : 
                                                    <>
                                                        <td className="text-center text-danger">{d.anzahl}</td>
                                                        <td className="text-end text-danger">{formatNumber(d.preis) }</td>
                                                        <td className="text-end text-danger">
                                                            <div className={classOfNumber} >
                                                                {formatNumber(d.preis * d.anzahl)}
                                                            </div>
                                                        </td>
                                                    </>}
                                                <td className="text-center">
                                                    <button className="btn btn-primary" onClick={(e) => {
                                                            e.preventDefault(); 
                                                            incGetränk(d.id, d.anzahl); 
                                                            }} >
                                                        +
                                                    </button>
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-primary"  onClick={(e) => {
                                                            e.preventDefault(); 
                                                            decGetränk(d.id, d.anzahl);}}>
                                                        -
                                                    </button>
                                                </td>
                                                <td className="text-center">
                                                    <button className="bg-danger text-light btn btn-primary"  
                                                        onClick={() => {setCurrentDeckelId(d.id); setCurrentKundenId(k.id); setShowModalEintrag(true);}}>
                                                        {(screenSize ==="sm" || screenSize ==="xs" ) ? 
                                                            <i className="bi bi-x-square"></i> 
                                                            : <span>Löschen</span>}
                                                    </button>
                                                </td>
                                            </tr>
                                        )})}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Gesamt:</td>
                                        <td className={`text-end fw-bolder ${berechneGesamtsummeKunde(k.id) >= 0 ? "text-primary" : "text-danger"}`}>{formatNumber(berechneGesamtsummeKunde(k.id))}</td>
                                        <td colSpan="3"></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="text-end">
                                            <button className="btn btn-primary"
                                                onClick={() => {setCurrentKundenId(k.id); setShowModalDeckel(true)}}>
                                                Bezahlen
                                            </button>
                                        </td>
                                        <td colSpan="3"></td>
                                    </tr>
                                </tfoot>
                            </table> 
                        </div>
                    )
                })
            }
            <Dialog show={showModalDeckel}
                title='Achtung'
                text='Wollen Sie wirklich bezahlen? Der Deckel wird dann gelöscht!'
                nurOK={false}
                handleClose={() => setShowModalDeckel(false)}
                handleOK={() => {setShowModalDeckel(false); deleteDeckel(currentKundenId)}}/>

            <Dialog show={showModalEintrag}
                title='Achtung'
                text='Soll der Eintrag wirklich gelöscht werden?'
                nurOK={false}
                handleClose={() => setShowModalEintrag(false)}
                handleOK={() => {setShowModalEintrag(false); delGetränk()}}/>
        </div>
    );
}

export default Deckelliste;