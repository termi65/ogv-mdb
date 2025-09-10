import { useEffect, useRef, useState } from "react";
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
    const geladen = useRef(false);

    // Funktionen
    const berechneGesamtsummeKunde = (kid) => {
        const filteredvl = deckelliste.filter((dck) => dck.kundenId === kid);
        return filteredvl.reduce((sum, vl) => sum + vl.preis * vl.anzahl, 0);
    }

    const incGetränk = async (id, anzahl) => {
        try {
            await db.deckel.update(id, {anzahl: anzahl+1});
            ladeDaten();
        }
        catch (error) {
            alert("Fehler! " + error);
        }
    }

    const decGetränk = async (id, anzahl) => {
        try {
            await db.deckel.update(id, {anzahl: anzahl-1});
            ladeDaten();
        }
        catch (error) {
            alert("Fehler! " + error);
        }
    }

    const löscheAlleDeckel = async () => {
        await db.deckel.clear();
        ladeDaten();
    }
    
    const delGetränk = async () => {
        try {
            await db.deckel
                .where("id")
                .equals(currentDeckelId)
                .delete();
            ladeDaten();
        }
        catch (error) {
            alert("Fehler! " + error);
        }
    }

    const kundenMitDeckel = async(dl) => {
        const alleKunden = await db.kunden.toArray();
        let kmd = [];
        let index = -1;
        await alleKunden.map((k) => {
            index = dl.findIndex((el) => el.kundenId === k.id);
            if (index >= 0)
                kmd.push(k);
        })
        return kmd;
    }

    const ladeDaten = async () => {
        const dl = await db.deckel.toArray();
        const kl = await kundenMitDeckel(dl);
        const gl = await db.getränke.toArray();
        
        // Evtl. sortiert!
        // const dlMitNamen = dl.sort((a, b) => a.kundenId - b.kundenId).map(eintrag => {

        const dlMitNamen = dl.map(eintrag => {
            const kunde = kl.find(k => k.id === eintrag.kundenId);
            const getränk = gl.find(g => g.id === eintrag.getränkId);
            return {
                ...eintrag,
                kundenName: kunde ? kunde.name + ' ' + kunde.vorname: "Unbekannt",
                getränkName: getränk ? getränk.bezeichnung : "Unbekannt",
                preis: getränk ? getränk.preis : 0
            };
        });

        setDeckelliste(dlMitNamen);
        setKunden(kl);
        setGetränke(gl);
    };

    useEffect(() => {
        
        if (geladen.current) return;
        ladeDaten();
        console.log("useEffect");
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
            {
                deckelliste.map((d) => {
                    return (
                        <div key={d.kundenId} className="mt-2">
                            <p className="">{d.kundenName}
                                <button className="ms-2 btn border-primary rounded" onClick={() => navigate(`/deckel/${ku.id}`)}>+</button>
                            </p>
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
                                    <tr key={d.id} className="p-2 border-b">
                                        <td>{d.getränkName}</td> 
                                        {d.anzahl >= 0 ? 
                                            <>
                                                <td className="text-center">{d.anzahl}</td>
                                                <td className="text-end">{formatNumber(d.preis) }</td>
                                                <td className="text-end">{formatNumber(d.preis * d.anzahl)}</td>
                                            </> 
                                            : 
                                            <>
                                                <td className="text-center text-danger">{d.anzahl}</td>
                                                <td className="text-end text-danger">{formatNumber(d.preis) }</td>
                                                <td className="text-end text-danger">{formatNumber(d.preis * d.anzahl)}</td>
                                            </>}
                                        <td className="text-center">
                                            <button className="btn btn-primary" onClick={(e) => {e.preventDefault(); incGetränk(d.id, d.anzahl); }}>
                                                +
                                            </button>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-primary"  onClick={(e) => {e.preventDefault(); decGetränk(d.id, d.anzahl);}}>
                                                -
                                            </button>
                                        </td>
                                        <td className="text-center">
                                            <button className="bg-danger text-light btn btn-primary"  
                                                onClick={() => {setCurrentDeckelId(d.id); setShowModalEintrag(true);}}>
                                                {(screenSize ==="sm" || screenSize ==="xs" ) ? 
                                                    <i className="bi bi-x-square"></i> 
                                                    : <span>Löschen</span>}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Gesamt:</td>
                                        <td className={`text-end fw-bolder ${berechneGesamtsummeKunde(d.kundenId) >= 0 ? "text-primary" : "text-danger"}`}>{formatNumber(berechneGesamtsummeKunde(d.kundenId))} €</td>
                                        <td colSpan="3"></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="text-end">
                                            <button className="btn btn-primary"
                                                onClick={() => {setCurrentKundenId(d.kundenId); setShowModalDeckel(true)}}>
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
            {/* {kunden.map((ku) => {
                const einträge = deckelliste.filter(d => d.kundenId = ku.id)
                if (einträge.length === 0) {
                    return null;
                }
                return (
                    <div key={ku.id} className="mt-2">
                        <p className="">{ku.name} {ku.vorname}
                            <button className="ms-2 btn border-primary rounded" onClick={() => navigate(`/deckel/${ku.id}`)}>+</button>
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
                                    {einträge.map((eintrag) => {
                                        const getränk = getränke.find ((g) => g.id === eintrag.getränkId)
                                        return (
                                                <tr key={eintrag.id} className="p-2 border-b">
                                                    <td>{getränk ? getränk.bezeichnung : 'null'}</td> 
                                                    {eintrag.anzahl >= 0 ? 
                                                        <>
                                                            <td className="text-center">{eintrag.anzahl}</td>
                                                            <td className="text-end">{getränk ? formatNumber(getränk.preis) : 0}</td>
                                                            <td className="text-end">{getränk ? formatNumber(getränk.preis * eintrag.anzahl) : 0}</td>
                                                        </> 
                                                        : 
                                                        <>
                                                            <td className="text-center text-danger">{eintrag.anzahl}</td>
                                                            <td className="text-end text-danger">{getränk ? formatNumber(getränk.preis) : 0}</td>
                                                            <td className="text-end text-danger">{getränk ? formatNumber(getränk.preis * eintrag.anzahl) : 0}</td>
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
                                        <td className={`text-end fw-bolder ${berechneGesamtsummeKunde(ku.id) >= 0 ? "text-dark" : "text-danger"}`}>{formatNumber(berechneGesamtsummeKunde(ku.id))} €</td>
                                        <td colSpan="3"></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="text-end">
                                            <button className="btn btn-primary"
                                                onClick={() => {setCurrentKundenId(ku.id); setShowModalDeckel(true)}}>
                                                Bezahlen
                                            </button>
                                        </td>
                                        <td colSpan="3"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            )} */}
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
                handleOK={() => {setShowModalEintrag(false); delGetränk()}}/>
        </div>
    );
}

export default Deckelliste;