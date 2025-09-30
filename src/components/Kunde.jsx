import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

// useDb aus dem DbContext gibt actDb (aktueller Datenbankname) 
// und setActDb() (Die Funktion zum Ändern des Datenbanknamens) zurück!
import { useDb } from "../utils/DbContext.jsx";
// Mit der Funktion getDb(aktuellerDatenbankName)
import { getDb } from '../utils/dbAdapter'

export default function Kunde() {
    
    const [name, setName] = useState("");
    const [vorname, setVorname] = useState("");
    const [geburtstag, setGeburtstag] = useState("");
    const [currentId, setCurrentId] = useState(0);
    const { actDb, setActDb } = useDb();
    const db = getDb(actDb);
    
    const {id} = useParams();
    const navigate = useNavigate()
    const inputRef = useRef(null);
    
    async function ladeKunde(id) {
        const kunde = await db.ladeKunde(id);
        setName(kunde.name);
        setVorname(kunde.vorname);
        setGeburtstag(kunde.geburtstag);
    }

    async function save(e) {
        e.preventDefault();
        await db.speichereKunde(currentId, name, vorname, geburtstag);
        navigate("/kunden");
    }

    function cancel() {
        navigate("/kunden");
    }
    
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            navigate("/kunden");
        }
    }
    useEffect(() => {
        if (id != "0") {
            setCurrentId(parseFloat(id));
            ladeKunde(parseFloat(id));
        }
        inputRef.current.focus();
    },[])

    return (
        <div>
            <div className="container text-start">
                <div className="row">
                    {(id != 0) ? <h2 className="text-info bg-dark p-2 text-center">Kunde {name} {vorname} bearbeiten</h2>
                        : 
                        <h2 className="text-info bg-dark p-2 text-center">Neuer Kunde</h2> 
                        }
                </div>
                <form onSubmit={save}>
                    <div className="row m-2">
                        <div className="col-sm-3"><label  className="input-group-text" htmlFor='name'>Name: </label></div>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <input id='name' 
                                    ref={inputRef}
                                    aria-describedby="Nachname" className="form-control" 
                                    placeholder="Nachname" 
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    value={name} />
                            </div>
                        </div>
                    </div>
                    <div className="row m-2">
                        <div className="col-sm-3"><label  className="input-group-text" htmlFor='vorname'>Vorname: </label></div>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <input id='vorname' 
                                    aria-describedby="Vorname" className="form-control" 
                                    placeholder="Vorname"
                                    required
                                    onChange={(e) => setVorname(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    value={vorname} />
                            </div>
                        </div>
                    </div>
                    <div className="row m-2">
                        <div className="col-sm-3"><label  className="input-group-text" htmlFor='geburtstag'>Geburtstag: </label></div>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <input id='geburtstag' 
                                    aria-describedby="Geburtstag" className="form-control" 
                                    placeholder="Geburtstag" 
                                    onChange={(e) => setGeburtstag(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    value={geburtstag} />
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
                                <button className="m-1 w-100 rounded btn btn-primary" type="submit"
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