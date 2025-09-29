import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';

import { DbProvider } from './utils/DbContext.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <DbProvider>
                <App />
            </DbProvider>
        </BrowserRouter>
    </StrictMode>,
)
