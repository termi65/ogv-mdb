import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useScreenSize from "../utils/useScreenSize";
import Dialog from "./Dialog";

import * as mdb from "../utils/dbfunctions";

export default function Kunden() {
    const [showModalEintrag, setShowModalEintrag] = useState(false);
    const [kunden, setKunden] = useState([]);
    const [currentKundenId, setCurrentKundenId] = useState(-1);
    const navigate = useNavigate();
    const screenSize = useScreenSize();

    useEffect(() => {
        loadKunden();
    },[])
    
    async function loadKunden() {
        const alleKunden = await mdb.ladeKunden();
        setKunden(alleKunden); 
    }

    function editKunde(id) {
        navigate(`/kunde/${id}`);
    }

    async function kundeLöschbar(id) {
        const fd = await mdb.deckelMitKundenIdExistiert(id);
        if (fd) {
            alert("Kunde hat einen Deckel und kann nicht gelöscht werden!");
        } else {
            setShowModalEintrag(true);
        }
    }

    async function deleteKunde() {
        await mdb.löscheKunde(currentKundenId);
        loadKunden();
    }

    async function löscheKunde(id) {
        setCurrentKundenId(id);
        kundeLöschbar(id);
    }

    return (
        <div className="container mt-4">
            <h2 className="text-info bg-dark p-2 text-center">Kundenliste
                <button type="button" onClick={() => navigate("/kunde/0")} className="ms-2 p-2 btn btn-primary">
                        <i className="bi bi-clipboard-plus"></i>
                </button>
            </h2>
            <table className="table table-bordered mt-2 border-primary p-1">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Vorname</th>
                            <th>Geburstag</th>
                            {screenSize ==="sm" || screenSize ==="xs" ? 
                                <th className="text-center">
                                    <i className="bi bi-pencil-square"></i>
                                </th> 
                                :
                                <th className="text-center">Bearbeiten</th>
                            }
                            {screenSize ==="sm" || screenSize ==="xs" ? 
                                <th className="text-center">
                                    <i className="bi bi-x-square"></i>
                                </th>
                                :
                                <th className="text-center">Löschen</th>
                            }
                            
                        </tr>
                    </thead>
                    <tbody>
                    {
                    kunden.map((kunde) => (
                        <tr key={kunde.id}>
                            <td>{kunde.name}</td>
                            <td>{kunde.vorname}</td>
                            <td>{kunde.geburtstag}</td>
                            {screenSize ==="sm" || screenSize ==="xs" ? 
                                <td className="text-center">
                                    <button type="button" className="btn bg-primary text-light"
                                        onClick={() => editKunde(kunde.id)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </td> 
                                :
                                <td className="text-center">
                                    <button type="button" className="btn bg-primary text-light"
                                        onClick={() => editKunde(kunde.id)}>
                                        Bearbeiten
                                    </button>
                                </td>
                            }
                            {screenSize ==="sm" || screenSize ==="xs" ? 
                                <td className="text-center">
                                    <button type="button" className="btn bg-danger text-light"
                                        onClick={() => löscheKunde(kunde.id)}>
                                        <i className="bi bi-x-square"></i>
                                    </button>
                                    
                                </td>
                                :
                                <td className="text-center">
                                <button type="button" className="btn bg-danger text-light"
                                    onClick={() => löscheKunde(kunde.id)}>
                                    Löschen
                                </button>
                            </td>
                            }
                        </tr>
                    ) )
                }
                </tbody>
            </table>
            <Dialog show={showModalEintrag}
                title='Achtung'
                text='Soll der Kunde wirklich gelöscht werden?'
                nurOK={false}
                handleClose={() => setShowModalEintrag(false)}
                handleOK={() => {setShowModalEintrag(false); deleteKunde()}}/>

        </div>
    );
}