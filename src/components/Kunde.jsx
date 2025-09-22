import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../utils/db";

export default function Kunde() {
    
    const [name, setName] = useState("");
    const [vorname, setVorname] = useState("");
    const [geburtstag, setGeburtstag] = useState(null);

    const [currentId, setCurrentId] = useState(0);
    const {id} = useParams();
    const navigate = useNavigate()
    const inputRef = useRef(null);
    
    async function ladeKunde(db_id) {
        const kunde = await db.kunden.where({
            id: db_id
        }).first();
        setName(kunde.name);
        setVorname(kunde.vorname);
        setGeburtstag(kunde.geburtstag);
    }

    async function save() {
        try {
            if (currentId != 0) await db.kunden.update(currentId, {name:name, vorname: vorname, geburtstag: geburtstag})
            else await db.kunden.add({name:name, vorname: vorname, geburtstag: geburtstag})
        }
        catch {
            alert("Fehler beim Speichern!");
        }
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
                    {id ? <h2 className="text-info bg-dark p-2 text-center">Neuer Kunde</h2> 
                        : 
                        <h2 className="text-info bg-dark p-2 text-center">Kunde bearbeiten</h2>
                        }
                </div>
                <div className="row m-2">
                    <div className="col-sm-3"><label  className="input-group-text" htmlFor='name'>Name: </label></div>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input id='name' 
                                ref={inputRef}
                                aria-describedby="Nachname" className="form-control" 
                                placeholder="Nachname" 
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
            </div>
            <div className="row">
            <div className="position-relative">
                <div className="position-absolute bg-secondary top-0 start-50 translate-middle-x">
                    <button className="m-1 text-center"
                        onClick={save}
                        onKeyDown={handleKeyDown}>
                            Speichern
                    </button>
                    <button className="m-1 text-center"
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