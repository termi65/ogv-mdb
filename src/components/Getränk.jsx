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

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await mdb.speichereGetränk(currentId, bezeichnung, parseFloat(preis));
            console.log(res);
        }
        catch (error) {
            alert("Fehler beim Speichern!" + error);
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
                    {(id != 0) ? <h2 className="text-info bg-dark p-2 text-center">Getränk {bezeichnung} bearbeiten</h2>
                        : <h2 className="text-info bg-dark p-2 text-center">Neues Getränk</h2> }
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-2">
                        <div className="col-sm-3"><label  className="input-group-text text-info" htmlFor='bezeichnung'>Bezeichnung: </label></div>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <input id='bezeichnung' ref={inputRef}
                                    aria-describedby="Getränkebezeichnung" className="form-control" 
                                    placeholder="Getränkebezeichnung" 
                                    required
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
                                <input id='preis' 
                                    type='number' min="0" step="0.1"
                                    aria-describedby="Preis" className="form-control" 
                                    placeholder="Preis"
                                    required
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setPreis(e.target.value)}
                                    value={preis} />
                            </div>
                        </div>
                    </div>
                
                    <div className="row">
                        <div className="row p-3">
                            <div className="col">
                                <button className="m-1 w-100 rounded btn btn-primary" type="submit"
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
                </form>
            </div>
        </div>
    )
}