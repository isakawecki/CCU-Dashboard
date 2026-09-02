// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';

// Importa os estilos da sua pasta pages
import './pages/telemetria.css'; 

// Importa os dados e as páginas conforme sua árvore de pastas
import { dadosIniciais } from './dados';
import { Redes } from './pages/Redes';
import { Telemetria } from './pages/Telemetria';

const categoriasVeiculos = ["Ônibus", "Caminhão", "Moto", "Carro", "Caminhonete", "Van", "SUV", "Esportivo", "Trator", "Ambulância"];
const rotasDisponiveis = ["/", ...categoriasVeiculos.map(c => `/frota/${c}`)];

function DashboardRouter() {
  const [statusLinks, setStatusLinks] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true });
  const toggleLink = (id) => setStatusLinks(prev => ({ ...prev, [id]: !prev[id] }));

  const navigate = useNavigate();
  const location = useLocation();
  const [tempoRestante, setTempoRestante] = useState(5);

  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const indiceAtual = rotasDisponiveis.indexOf(decodeURIComponent(location.pathname));
      const proximoIndice = (indiceAtual + 1) % rotasDisponiveis.length;
      navigate(rotasDisponiveis[proximoIndice]);
      setTempoRestante(5);
    }
  }, [tempoRestante, location.pathname, navigate]);

  return (
    <div>
      <nav className="navbar navbar-dark bg-black bg-opacity-75 shadow-lg border-bottom border-info sticky-top">
        <div className="container-fluid flex-column align-items-start px-3 py-2">
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <span className="navbar-brand fw-bold text-info m-0 d-flex align-items-center">
              <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" title="Google Maps" className="spinning-globe"></a>
              CCU COMMAND CENTER
            </span>
            <span className="badge bg-transparent border border-info text-info px-3 py-2">
              AUTO-SWAP: 00:0{tempoRestante}
            </span>
          </div>

          <div className="nav-scroll w-100 gap-2">
            <Link 
              to="/" 
              onClick={() => setTempoRestante(5)} 
              className={`btn btn-sm text-nowrap px-4 py-2 ${location.pathname === '/' ? 'btn-info text-dark fw-bold shadow' : 'btn-outline-info text-white'}`}>
              📡 Redes e Conectividade
            </Link>

            {categoriasVeiculos.map((cat) => {
              const rotaAtiva = decodeURIComponent(location.pathname) === `/frota/${cat}`;
              let iconeBotao = "🚚";
              if (cat === "Moto") iconeBotao = "🏍";
              else if (cat === "Carro" || cat === "SUV" || cat === "Esportivo") iconeBotao = "🚗";
              else if (cat === "Ônibus" || cat === "Van") iconeBotao = "🚌";
              else if (cat === "Ambulância") iconeBotao = "🚑";
              else if (cat === "Trator") iconeBotao = "🚜";

              return (
                <Link 
                  key={cat} 
                  to={`/frota/${cat}`} 
                  onClick={() => setTempoRestante(5)} 
                  className={`btn btn-sm text-nowrap px-3 py-2 ${rotaAtiva ? 'btn-light text-dark fw-bold shadow' : 'btn-outline-light text-white'}`}>
                  {iconeBotao} {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Redes dados={dadosIniciais.infraestrutura} statusLinks={statusLinks} toggleLink={toggleLink} />} />
          <Route path="/frota/:categoria" element={<Telemetria frota={dadosIniciais.frota} statusLinks={statusLinks} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DashboardRouter />
    </BrowserRouter>
  );
}