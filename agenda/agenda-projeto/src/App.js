import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgendaCliente from './componentes/AgendaCliente';
import AgendaProprietaria from './componentes/AgendaProprietaria';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AgendaCliente />} />
                <Route path="/proprietaria" element={<AgendaProprietaria />} />
            </Routes>
        </Router>
    );
}

export default App;
