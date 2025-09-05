import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../db";
import useScreenSize from "../utils/useScreenSize";

export default function Kunden() {
    const [kunden, setKunden] = useState([]);
    const navigate = useNavigate();
    const screenSize = useScreenSize();

    useEffect(() => {
        loadKunden();

    },[])
    
    async function loadKunden() {
        const alleKunden = await db.kunden.toArray();
        setKunden(alleKunden); 
    }

    function editKunde(id) {
        navigate(`/kunde/${id}`);
    }

     async function deleteKunde(id) {
        const findDeckel = await db.deckel.where({
            kundenId: id}).first();
        
        if (findDeckel){
            alert("Deckel vorhanden. Kann Kunden nicht löschen!");
        } else {
            console.log("Keine Deckel vorhanden - Kunde wird gelöscht!");
            await db.kunden.delete(id);
            loadKunden();
        }
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
                                        onClick={() => deleteKunde(kunde.id)}>
                                        <i className="bi bi-x-square"></i>
                                    </button>
                                    
                                </td>
                                :
                                <td className="text-center">
                                <button type="button" className="btn bg-danger text-light"
                                    onClick={() => deleteKunde(kunde.id)}>
                                    Löschen
                                </button>
                            </td>
                            }
                        </tr>
                    ) )
                }
                </tbody>
            </table>
        </div>
    );
}