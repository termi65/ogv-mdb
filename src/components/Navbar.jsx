import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../utils/supabase";

export default function Navbar() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const [user, setUser] = useState(null);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
    const closeNav = () => {
        setIsNavCollapsed(true);
    };


    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Fehler beim Abmelden:', error.message);
      };

      useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user);
        };
        
        checkUser();
        
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => authListener?.subscription.unsubscribe();
    }, []);

    return (
        <div className="d-flex flex-column p-4 align-items-center bg-dark">
            <nav className="navbar fixed-top navbar-expand-md navbar-dark bg-dark navbar-on-top">
                <div className="container">
                    <button className="navbar-toggler" 
                            type="button"
                            data-bs-toggle="collapse" 
                            data-bs-target="#togglerData" 
                            aria-controls="togglerData" 
                            aria-expanded={!isNavCollapsed ? true : false}
                            aria-label="Toggle navigation"
                            onClick={handleNavCollapse}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="togglerData">
                        <ul className="navbar-nav me-auto ">
                            <li><p> </p></li>
                            <li className="nav-item" key={1}>
                                <Link to="/" className="px-2 text-info" onClick={closeNav}><i className="bi bi-house-door"></i>Start</Link>
                            </li>
                            <li><p> </p></li>
                            <li className="nav-item" key={2}>
                                <Link to="/getraenke" className="px-2 text-info" onClick={closeNav}><i className="bi bi-shop"></i>Getränke</Link>
                            </li>
                            <li className="nav-item" key={3}>
                                <Link to="/kunden" className="px-2 text-info" onClick={closeNav}><i className="bi bi-file-earmark-person-fill"></i>Kunden</Link>
                            </li>
                            <li className="nav-item" key={4}>
                                <Link to="/deckelliste" className="px-2 text-info" onClick={closeNav}><i className="bi bi-bookmark-plus-fill"></i>Deckel</Link>
                            </li>
                            {user ? 
                                <li className="nav-item pe-1" key={5}>
                                    <Link to="/" className="px-2 text-info" onClick={() => {closeNav(); handleLogout();}}><i className="bi bi-lock"></i>Logout</Link>
                                </li>
                                :
                                <li className="nav-item pe-1" key={6}>
                                    <Link to="/login" className="px-2 text-info" onClick={closeNav}><i className="bi bi-unlock"></i>Login</Link>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}