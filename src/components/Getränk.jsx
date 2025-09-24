import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import * as mdb from "../utils/dbfunctions";

export default function Getränk() {
    const inputRef = useRef(null);
    const [bezeichnung, setBezeichnung] = useState("");
    const [preis, setPreis] = useState(0);
    const [currentId, setCurrentId] = useState(0);
    const {id} = useParams();
    const navigate = useNavigate()
    
    async function ladeGetränk(id) {
        const getränk = await mdb.ladeGetränk(id);
        setBezeichnung(getränk.bezeichnung);
        setPreis(getränk.preis);
    }

    async function save() {
        try {
            await mdb.speichereGetränk(currentId, bezeichnung, parseFloat(preis))
        }
        catch {
            alert("Fehler beim Speichern!");
        }
        navigate("/getraenke");
    }

    function cancel() {
        navigate("/getraenke");
    }

    const handleKeyDown = (e) => {
        if (e.key === "Escape") navigate("/getraenke");

    }
    
    useEffect(() => {
        if (id != "0") {
            setCurrentId(parseFloat(id));
            ladeGetränk(parseFloat(id));
        }
        inputRef.current.focus();
    },[])

    return (
        <div>
            <div className="container">
                <div className="row">
                    {id ? <h2 className="text-info bg-dark p-2 text-center">Neues Getränk</h2> 
                        : <h2 className="text-info bg-dark p-2 text-center">Getränk bearbeiten</h2>}
                </div>
                <div className="row mb-2">
                    <div className="col-sm-3"><label  className="input-group-text text-info" htmlFor='bezeichnung'>Bezeichnung: </label></div>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input id='bezeichnung' ref={inputRef}
                                aria-describedby="Getränkebezeichnung" className="form-control" 
                                placeholder="Getränkebezeichnung" 
                                onKeyDown={handleKeyDown}
                                onChange={(e) => setBezeichnung(e.target.value)}
                                value={bezeichnung} />
                        </div>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-sm-3"><label  className="input-group-text text-info" htmlFor='preis'>Preis: </label></div>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input id='preis' type='number' min="0"
                                aria-describedby="Preis" className="form-control" 
                                placeholder="Preis" 
                                onKeyDown={handleKeyDown}
                                onChange={(e) => setPreis(e.target.value)}
                                value={preis} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="row p-3">
                    <div className="col">
                        <button className="m-1 w-100 rounded btn btn-primary" 
                            onClick={save}
                            onKeyDown={handleKeyDown}>
                                Speichern
                        </button>
                    </div>
                    <div className="col">
                        <button className="m-1 w-100 rounded btn btn-primary"
                            onClick={cancel}
                            onKeyDown={handleKeyDown}>
                                Abbrechen
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}