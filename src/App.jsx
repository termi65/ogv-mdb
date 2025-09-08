import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Getränke from "./components/Getränke";
import Getränk from "./components/Getränk";
import Kunde from "./components/Kunde";
import Kunden from "./components/Kunden";
import Deckelliste from "./components/Deckelliste";
import Deckel from "./components/Deckel";

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
                <Route path="/deckelliste" element={<Deckelliste />} />
                <Route path="/deckel/:kundenId" element={<Deckel />} />
            </Routes>
        </div>
    );
}

export default App;




