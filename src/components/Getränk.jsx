import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../db";

export default function Getränk() {
    
    const [bezeichnung, setBezeichnung] = useState("");
    const [preis, setPreis] = useState(0);
    const [currentId, setCurrentId] = useState(0);
    const {id} = useParams();
    const navigate = useNavigate()
    
    async function ladeGetränk(db_id) {
        const getränk = await db.getränke.where({
            id: db_id
        }).first();
        setBezeichnung(getränk.bezeichnung);
        setPreis(getränk.preis);
    }

    async function save() {
        try {
            if (currentId != 0) await db.getränke.update(currentId, {bezeichnung:bezeichnung, preis: parseFloat(preis)})
            else await db.getränke.add({bezeichnung:bezeichnung, preis: parseFloat(preis)})
        }
        catch {
            alert("Fehler beim Speichern!");
        }
        navigate("/getraenke");
    }

    function cancel() {
        navigate("/getraenke");
    }
    
    useEffect(() => {
        if (id != "0") {
            setCurrentId(parseFloat(id));
            ladeGetränk(parseFloat(id));
        }
    },[])

    return (
        <div>
            <div className="container text-start">
                <div className="row">
                    {id ? <h2>Neues Getränk</h2> : <h2>Getränk bearbeiten</h2>}
                </div>
                <div className="row m-2">
                    <div className="col-sm-3"><label  className="input-group-text" htmlFor='bezeichnung'>Bezeichnung: </label></div>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input id='bezeichnung' 
                                aria-describedby="Getränkebezeichnung" className="form-control" 
                                placeholder="Getränkebezeichnung" onChange={(e) => setBezeichnung(e.target.value)}
                                value={bezeichnung} />
                        </div>
                    </div>
                </div>
                <div className="row m-2">
                    <div className="col-sm-3"><label  className="input-group-text" htmlFor='preis'>Preis: </label></div>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input id='preis' type='number' min="0"
                                aria-describedby="Preis" className="form-control" 
                                placeholder="Preis" onChange={(e) => setPreis(e.target.value)}
                                value={preis} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
            <div className="position-relative">
                {/* <div className="col-sm-6"> */}
                    <div className="position-absolute bg-secondary top-0 start-50 translate-middle-x">
                        <button className="m-1 text-center" onClick={save}>Speichern</button>
                        <button className="m-1 text-center" onClick={cancel}>Abbrechen</button>
                    </div>
                {/* </div> */}
            </div>
            </div>

        </div>
    )
}