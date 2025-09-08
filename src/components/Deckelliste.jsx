import { useEffect, useState } from "react";
import useScreenSize from "../utils/useScreenSize";
import Dialog from "./Dialog";
import { useNavigate } from "react-router-dom";
import { db } from "../db";
import formatNumber from "../utils/formatNumber";

const Deckelliste = () => {
    const screenSize = useScreenSize();
    const navigate = useNavigate();
    
    // Für die modalen Dialog relevanten Variablen
    const [showModalDeckel, setShowModalDeckel] = useState(false);
    const [showModalEintrag, setShowModalEintrag] = useState(false);
    const [deckelliste, setDeckelliste] = useState([]);
    const [kunden, setKunden] = useState([]);
    const [getränke, setGetränke] = useState([]);
    const [currentKundenId, setCurrentKundenId] = useState(0);
    const [currentDeckelId, setCurrentDeckelId] = useState(0);

    const [kundenMitDeckel, setKundenMitDeckel] = useState([]);

    // Funktionen
    const berechneGesamtsummeKunde = (kid) => {
        const filteredvl = deckelliste.filter((item) => item.kundenId === kid);
        return filteredvl.reduce((sum, vl) => sum + vl.getränke.preis * vl.anzahl, 0);
    }

    const incGetränk = async (id, anzahl) => {
        try {
            await db.deckel.update(id, {anzahl: anzahl+1});
            onRefresh();
        }
        catch (error) {
            alert("Fehler! " + error);
        }
    }

    const decGetränk = async (id, anzahl) => {
        try {
            await db.deckel.update(id, {anzahl: anzahl-1});
            onRefresh();
        }
        catch (error) {
            alert("Fehler! " + error);
        }
    }

    const delGetränk = async (id) => {
        try {
            await db.deckel
                .where("id")
                .eq(currentDeckelId)
                .delete();
            onRefresh();
        }
        catch (error) {
            alert("Fehler! " + error);
        }
    }

    const ladeDaten = async () => {
        const dl = await db.deckel.toArray();
        setDeckelliste (dl);
        const kl = await db.kunden.toArray();
        setKunden (kl);

        const kmd = kl.filter(kunde =>
            dl.some(v => v.kundenId === kunde.id)
        );
        setKundenMitDeckel(kmd);

        const gl = await db.getränke.toArray();
        setGetränke(gl);
    }

    const onEdit = () => {
        navigate(`deckel/${currentDeckelId}`);
    }
    const löscheAlleDeckel = async () => {
        await db.deckel.clear();
    }

    useEffect(() => {
        ladeDaten();
    },[]);

    return (
        <div className="container mt-4">
            <h2 className="text-info bg-dark p-2 text-center">Deckelsammlung 
                <button type="button" className="ms-2 p-2 btn btn-primary" onClick={() => navigate(`/deckel/0`)}>
                    <i className="bi bi-cart-plus"></i>
                </button>
            </h2>
            <button className="btn btn-success btn-sm" onClick={löscheAlleDeckel}>
                alle Löschen
            </button>
            {kundenMitDeckel.map((m) => (
                    <div key={m.id} className="mt-2">
                        <p className="">{m.name} {m.vorname}
                            <button className="ms-2 btn border-primary rounded" onClick={() => onEdit(m)}>+</button>
                        </p>
                        <div >
                            <table className="table table-bordered mt-2 border-primary p-1">
                                <thead>
                                    <tr>
                                        <th>Artikel</th>
                                        <th className="text-center">#</th>
                                        <th className="text-end">€</th>
                                        <th className="text-end">∑</th>
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
                                    {deckelliste
                                        .filter((item) => item.kundenId === m.id)
                                        .map((eintrag) => {
                                            const getränk = getränke.find((g) => g.id === eintrag.getränke.id);
                                            return (
                                                <tr key={eintrag.id} className="p-2 border-b">
                                                    <td>{getränk.bezeichnung}</td> 
                                                    {eintrag.anzahl >= 0 ? 
                                                        <>
                                                            <td className="text-center">{eintrag.anzahl}</td>
                                                            <td className="text-end">{formatNumber(getränk.preis)}</td>
                                                            <td className="text-end">{formatNumber(getränk.preis * eintrag.anzahl)}</td>
                                                        </> 
                                                        : 
                                                        <>
                                                            <td className="text-center text-danger">{eintrag.anzahl}</td>
                                                            <td className="text-end text-danger">{formatNumber(getränk.preis)}</td>
                                                            <td className="text-end text-danger">{formatNumber(getränk.preis * eintrag.anzahl)}</td>
                                                        </>}
                                                    <td className="text-center">
                                                        <button className="btn btn-primary" onClick={(e) => {e.preventDefault(); incGetränk(eintrag.id, eintrag.anzahl); }}>
                                                            +
                                                        </button>
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-primary"  onClick={(e) => {e.preventDefault(); decGetränk(eintrag.id, eintrag.anzahl);}}>
                                                            -
                                                        </button>
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="bg-danger text-light btn btn-primary"  
                                                            onClick={() => {setCurrentDeckelId(eintrag.id); setShowModalEintrag(true);}}>
                                                                 {/* if (window.confirm("Soll der Eintrag wirklich gelöscht werden?") === true) {e.preventDefault(); delGetränk(eintrag.id);}}}> */}
                                                            {(screenSize ==="sm" || screenSize ==="xs" ) ? 
                                                             <i className="bi bi-x-square"></i> 
                                                             : <span>Löschen</span>}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Gesamt:</td>
                                        <td className={`text-end fw-bolder ${berechneGesamtsummeKunde(m.id) >= 0 ? "text-dark" : "text-danger"}`}>{formatNumber(berechneGesamtsummeKunde(m.id))} €</td>
                                        <td colSpan="3"></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="text-end">
                                            <button className="btn btn-primary"
                                                onClick={() => {setCurrentKundenId(m.id); setShowModalDeckel(true)}}>
                                                Bezahlen
                                            </button>
                                        </td>
                                        <td colSpan="3"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>)
                )}
            <Dialog show={showModalDeckel}
                title='Achtung'
                text='Wollen Sie wirklich bezahlen? Der Deckel wird dann gelöscht!'
                nurOK={false}
                handleClose={() => setShowModalDeckel(false)}
                handleOK={() => {setShowModalDeckel(false); onDelete(currentKundenId)}}/>

            <Dialog show={showModalEintrag}
                title='Achtung'
                text='Soll der Eintrag wirklich gelöscht werden?'
                nurOK={false}
                handleClose={() => setShowModalEintrag(false)}
                handleOK={() => {setShowModalEintrag(false); delGetränk(currentDeckelId)}}/>
        </div>
    );
}

export default Deckelliste;