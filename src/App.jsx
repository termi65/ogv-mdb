import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Getränke from "./components/Getränke";
import Getränk from "./components/Getränk";
import Kunde from "./components/Kunde";
import Kunden from "./components/Kunden";

function App() {
    

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/getraenke" element={<Getränke />} />
                <Route path="/getraenk/:id" element={<Getränk />} />
                <Route path="/kunden" element={<Kunden />} />
                <Route path="/kunde/:id" element={<Kunde />} />
            </Routes>
        </div>
    );
}

export default App;




