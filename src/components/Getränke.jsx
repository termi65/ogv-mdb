import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useScreenSize from "../utils/useScreenSize";
import formatNumber from "../utils/formatNumber";
import Dialog from "./Dialog";

import { getDb } from '../utils/dbAdapter'
import { useDb } from "../utils/DbContext.jsx";

export default function Getränke() {
    const [showModalEintrag, setShowModalEintrag] = useState(false);
    const [getränke, setGetränke] = useState([]);
    const [currentGetränkeId, setCurrentGetränkeId] = useState(-1);
    
    const [loaded, setLoaded]  = useState(false);

    const { actDb } = useDb();
    const setActDb = getDb(actDb);
    
    const navigate = useNavigate();
    const screenSize = useScreenSize();

    useEffect(() => {
        loadGetränke();

    },[])
    
    async function loadGetränke() {
        const allGetraenke = await setActDb.ladeGetränke();
        setGetränke(allGetraenke);
        setLoaded(true);
    }

    function editGetränk(id) {
        navigate(`/getraenk/${id}`);
    }

    async function getränkLöschbar(id) {
        const fd = await setActDb.deckelMitGetränkIdExistiert(id);
        if (fd) {
            alert("Getränke auf einem Deckel verzeichnet. Es kann nicht gelöscht werden!");
        } else {
            setShowModalEintrag(true);
        }
    }

    async function deleteGetränk() {
        await setActDb.löscheGetränk(currentGetränkeId);
        await loadGetränke();
    }

    async function löscheGetränk(id) {
        setCurrentGetränkeId(id);
        getränkLöschbar(id);
    }
    if (!loaded) {
        return <div>Lade...</div>;
    }
    return (
        <div className="container mt-4">
            <h2 className="text-info bg-dark p-2 text-center">Getränkeliste
                <button type="button" onClick={() => navigate("/getraenk/0")} className="ms-2 p-2 btn btn-primary">
                        <i className="bi bi-clipboard-plus"></i>
                </button>
            </h2>
            <table className="table table-bordered mt-2 border-primary p-1">
                    <thead>
                        <tr>
                            <th>Bezeichnung</th>
                            <th className="text-end">Preis (€)</th>
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
                    getränke.map((getränk) => (
                        <tr key={getränk.id}>
                            <td>{getränk.bezeichnung}</td>
                            <td className="text-end">{formatNumber(getränk.preis)}</td>
                            {screenSize ==="sm" || screenSize ==="xs" ? 
                                <td className="text-center">
                                    <button type="button" className="btn bg-primary text-light"
                                        onClick={() => editGetränk(getränk.id)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </td> 
                                :
                                <td className="text-center">
                                    <button type="button" className="btn bg-primary text-light"
                                        onClick={() => editGetränk(getränk.id)}>
                                        Bearbeiten
                                    </button>
                                </td>
                            }
                            {screenSize ==="sm" || screenSize ==="xs" ? 
                                <td className="text-center">
                                    <button type="button" className="btn bg-danger text-light"
                                        onClick={() => {löscheGetränk(Number(getränk.id));}}>
                                        <i className="bi bi-x-square"></i>
                                    </button>
                                    
                                </td>
                                :
                                <td className="text-center">
                                <button type="button" className="btn bg-danger text-light"
                                    onClick={() => {löscheGetränk(Number(getränk.id));}}>
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
                text='Soll das Getränk wirklich gelöscht werden?'
                nurOK={false}
                handleClose={() => setShowModalEintrag(false)}
                handleOK={() => {setShowModalEintrag(false); deleteGetränk()}}/>
        </div>
    )
}