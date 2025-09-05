import { Link } from "react-router-dom";
import { useState } from "react";


export default function Navbar() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
    const closeNav = () => {
        setIsNavCollapsed(true);
    };

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
                                <Link to="/getraenke" className="px-2 text-info" onClick={closeNav}><i class="bi bi-eye"></i>Getränke</Link>
                            </li>
                            <li className="nav-item" key={2}>
                                <Link to="/kunden" className="px-2 text-info" onClick={closeNav}><i class="bi bi-eyeglasses"></i>Kunden</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}